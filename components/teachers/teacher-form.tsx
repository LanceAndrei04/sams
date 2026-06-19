"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { checkEmployeeNumberUnique, Teacher, updateTeacher } from "@/lib/supabase/teachers";
import { getTeacherInitials } from "./teacher-display";

const optionalString = z.string().optional().nullable();
const teacherSchema = z.object({
  last_name: z.string().min(1, "Last name is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: optionalString,
  gender: optionalString,
  civil_status: optionalString,
  birthday: optionalString,
  cellphone_number: optionalString,
  personal_email: optionalString,
  deped_email: optionalString,
  province: optionalString,
  town: optionalString,
  barangay: optionalString,
  street: optionalString,
  tin: optionalString,
  employee_number: z.string().min(1, "Employee number is required"),
  designation: optionalString,
  item_status: z.enum(["own_station", "reassigned", "borrowed", "clustered"]),
  degree_finished: optionalString,
  prc_specialization: optionalString,
  minor_specialization: optionalString,
  post_graduate_degree: optionalString,
  prc_license_number: optionalString,
  philsys_number: optionalString,
  original_appointment_date: optionalString,
  current_station_start_date: optionalString,
  o365_account: optionalString,
  r4a3_account: optionalString,
  photo_url: optionalString,
  status: z.enum(["active", "inactive"]),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const personalFields = [
  ["last_name", "Last Name", "Required"],
  ["first_name", "First Name", "Required"],
  ["middle_name", "Middle Name", "Optional"],
  ["cellphone_number", "Cellphone Number", "Optional"],
  ["personal_email", "Personal Email", "Optional"],
  ["deped_email", "DepEd Email", "Optional"],
  ["province", "Province", "Optional"],
  ["town", "Town", "Optional"],
  ["barangay", "Barangay", "Optional"],
  ["street", "Street", "Optional"],
] as const;

const employmentFields = [
  ["tin", "TIN", "Optional"],
  ["employee_number", "Employee Number", "Required"],
  ["designation", "Designation", "Optional"],
  ["degree_finished", "Degree Finished/Baccalaureate", "Optional"],
  ["prc_specialization", "PRC Specialization", "Optional"],
  ["minor_specialization", "Minor Specialization", "Optional"],
  ["post_graduate_degree", "Post Graduate Degree", "Optional"],
  ["prc_license_number", "PRC License Number", "Optional"],
  ["philsys_number", "PhilSys Number", "Optional"],
  ["original_appointment_date", "Original Date of Appointment at DepEd", "Optional"],
  ["current_station_start_date", "Date of First Day of Service - New Station", "Optional"],
  ["o365_account", "0365 Account", "Optional"],
  ["r4a3_account", "R4A-3 Account", "Optional"],
] as const;

export default function TeacherForm({ teacher }: { teacher: Teacher }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(teacher.photo_url ?? null);
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { ...teacher },
  });
  const initials = useMemo(() => getTeacherInitials(form.getValues()), [form]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function onSubmit(data: TeacherFormValues) {
    setIsSubmitting(true);
    try {
      const isUnique = await checkEmployeeNumberUnique(data.employee_number, teacher.id);
      if (!isUnique) {
        form.setError("employee_number", { message: "This employee number is already assigned to another teacher" });
        return;
      }
      const saved = await updateTeacher(teacher.id, data);
      if (!saved) throw new Error("Teacher not found");
      toast.success("Teacher updated successfully");
      router.push(`/teachers/${teacher.id}`);
    } catch {
      toast.error("Could not save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function cancel() {
    if (form.formState.isDirty) setConfirmOpen(true);
    else router.push(`/teachers/${teacher.id}`);
  }

  function selectPhoto(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    form.setValue("photo_url", url, { shouldDirty: true });
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader><CardTitle>Edit Teacher</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <Section title="Personal Info">
              <SelectField form={form} name="gender" label="Gender" options={["Male", "Female"]} />
              <SelectField form={form} name="civil_status" label="Civil Status" options={["Single", "Married", "Widowed", "Separated"]} />
              <InputField form={form} name="birthday" label="Birthday" type="date" />
              {personalFields.map(([name, label, placeholder]) => <InputField key={name} form={form} name={name} label={label} placeholder={placeholder} />)}
            </Section>
            <Section title="Employment">
              <SelectField form={form} name="item_status" label="Item Status" options={["own_station", "reassigned", "borrowed", "clustered"]} />
              {employmentFields.map(([name, label, placeholder]) => <InputField key={name} form={form} name={name} label={label} placeholder={placeholder} />)}
            </Section>
            <Section title="Photo">
              <div className="flex items-center gap-4">
                <Avatar className="size-20">{preview ? <AvatarImage src={preview} alt="Teacher preview" /> : null}<AvatarFallback>{initials}</AvatarFallback></Avatar>
                <Input type="file" accept="image/*" onChange={(event) => selectPhoto(event.target.files?.[0])} />
              </div>
            </Section>
            <Section title="Status">
              <SelectField form={form} name="status" label="Status" options={["active", "inactive"]} />
            </Section>
            <div className="flex justify-end gap-3 border-t pt-6">
              <Button type="button" variant="outline" onClick={cancel} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <Dialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Discard changes?"
        description="Your edits have not been saved."
        confirmLabel="Discard"
        onConfirm={() => router.push(`/teachers/${teacher.id}`)}
      />
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="flex flex-col gap-4"><h2 className="text-lg font-semibold">{title}</h2><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div></section>;
}

function InputField({ form, name, label, type = "text", placeholder }: { form: ReturnType<typeof useForm<TeacherFormValues>>; name: keyof TeacherFormValues; label: string; type?: string; placeholder?: string }) {
  return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type={type} placeholder={placeholder} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} />;
}

function SelectField({ form, name, label, options }: { form: ReturnType<typeof useForm<TeacherFormValues>>; name: keyof TeacherFormValues; label: string; options: string[] }) {
  return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><Select value={String(field.value ?? "")} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger></FormControl><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{labelOption(option)}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />;
}

function labelOption(value: string) {
  return value.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

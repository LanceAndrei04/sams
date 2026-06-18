"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Grade,
  Section,
  StudentWithRelations,
  getSectionsByGrade,
  checkLrnExists,
  createStudent,
  updateStudent,
} from "@/lib/supabase/students";

// Validation schema
const studentSchema = z.object({
  gradeId: z.string().min(1, "Grade level is required"),
  sectionId: z.string().min(1, "Section is required"),
  lrn: z
    .string()
    .min(1, "LRN is required")
    .length(12, "LRN must be exactly 12 characters"),
  last_name: z.string().min(1, "Last name is required").trim(),
  first_name: z.string().min(1, "First name is required").trim(),
  middle_name: z.string().optional().or(z.literal("")),
  birthday: z.string().min(1, "Date of birth is required"),
  birthplace: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  father_name: z.string().optional().or(z.literal("")),
  mother_name: z.string().optional().or(z.literal("")),
  guardian_name: z.string().optional().or(z.literal("")),
  contact_number: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive", "Transferred"]),
  remarks: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  mode: "add" | "edit";
  studentId?: number;
  grades: Grade[];
  initialStudent?: StudentWithRelations | null;
}

export default function StudentForm({
  mode,
  studentId,
  grades,
  initialStudent,
}: StudentFormProps) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gradeId: initialStudent ? initialStudent.section.grade.id.toString() : "",
      sectionId: initialStudent ? initialStudent.section_id.toString() : "",
      lrn: initialStudent ? initialStudent.lrn : "",
      last_name: initialStudent ? initialStudent.last_name : "",
      first_name: initialStudent ? initialStudent.first_name : "",
      middle_name: initialStudent?.middle_name || "",
      birthday: initialStudent ? initialStudent.birthday : "",
      birthplace: initialStudent?.birthplace || "",
      address: initialStudent?.address || "",
      father_name: initialStudent?.father_name || "",
      mother_name: initialStudent?.mother_name || "",
      guardian_name: initialStudent?.guardian_name || "",
      contact_number: initialStudent?.contact_number || "",
      status: initialStudent ? initialStudent.status : "Active",
      remarks: initialStudent?.remarks || "",
    },
  });

  const selectedGradeId = watch("gradeId");
  const lrnValue = watch("lrn");
  const contactNumberValue = watch("contact_number");

  // Track if LRN is non-numeric (soft validation warning)
  const isLrnNonNumeric = lrnValue && !/^\d+$/.test(lrnValue);
  
  // Track if Contact Number is empty (soft validation warning)
  const isContactEmpty = !contactNumberValue || contactNumberValue.trim() === "";

  // Dynamic sections fetch when grade level changes
  useEffect(() => {
    if (!selectedGradeId) {
      setSections([]);
      setValue("sectionId", "");
      return;
    }

    let active = true;
    const loadSections = async () => {
      try {
        setLoadingSections(true);
        const res = await getSectionsByGrade(Number(selectedGradeId));
        if (active) {
          setSections(res);
          // If editing and grade matches original, make sure original section is selected.
          // Otherwise, clear the selection.
          if (initialStudent && initialStudent.section.grade.id.toString() === selectedGradeId) {
            setValue("sectionId", initialStudent.section_id.toString());
          } else {
            // Only clear if grade actually changed from default
            const currentSection = watch("sectionId");
            if (!res.some((s) => s.id.toString() === currentSection)) {
              setValue("sectionId", "");
            }
          }
        }
      } catch {
        toast.error("Failed to load sections for grade.");
      } finally {
        if (active) setLoadingSections(false);
      }
    };

    loadSections();
    return () => {
      active = false;
    };
  }, [selectedGradeId, initialStudent, setValue, watch]);

  // Window unload guard if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Cancel behavior
  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      router.push(mode === "edit" ? `/students/${studentId}` : "/students");
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    router.push(mode === "edit" ? `/students/${studentId}` : "/students");
  };

  // Submit Handler
  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);

      // 1. Uniqueness LRN check (server operation)
      const lrnExists = await checkLrnExists(data.lrn, mode === "edit" ? studentId : undefined);
      if (lrnExists) {
        setError("lrn", {
          type: "manual",
          message: "The LRN already exists.",
        });
        toast.error("Validation Error", {
          description: "The LRN already exists in the system registry.",
        });
        setSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        lrn: data.lrn,
        last_name: data.last_name,
        first_name: data.first_name,
        middle_name: data.middle_name || undefined,
        birthday: data.birthday,
        birthplace: data.birthplace || undefined,
        address: data.address || undefined,
        father_name: data.father_name || undefined,
        mother_name: data.mother_name || undefined,
        guardian_name: data.guardian_name || undefined,
        contact_number: data.contact_number || undefined,
        status: data.status,
        remarks: data.remarks || undefined,
        section_id: Number(data.sectionId),
      };

      let result: StudentWithRelations;
      if (mode === "add") {
        result = await createStudent(payload);
        toast.success("Student added successfully");
      } else {
        if (!studentId) throw new Error("Missing Student ID");
        result = await updateStudent(studentId, payload);
        toast.success("Student updated successfully");
      }

      // Redirect to the student's detail view
      router.push(`/students/${result.id}`);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Operation Failed", {
        description: errorMessage || "Unable to save student. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        {/* Navigation title */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === "add" ? "Register Student" : "Edit Student Details"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "add" ? "Enroll a new student in an active grade and section" : "Update records for existing student profile"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="bg-muted/10 border-b border-border/55">
              <CardTitle className="text-lg">Student Profile Form</CardTitle>
              <CardDescription>Fields marked with an asterisk (*) are strictly required.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6 divide-y divide-border/50">
              {/* SECTION 1: Enrollment details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">1. Enrollment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Grade */}
                  <div className="space-y-2">
                    <label htmlFor="gradeId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Grade level *
                    </label>
                    <select
                      id="gradeId"
                      {...register("gradeId")}
                      className={`w-full h-11 px-3 rounded-xl border bg-card text-foreground text-sm cursor-pointer ${
                        errors.gradeId ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                      }`}
                    >
                      <option value="">Select Grade</option>
                      {grades.map((g) => (
                        <option key={g.id} value={g.id.toString()}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    {errors.gradeId && (
                      <p className="text-xs text-red-500 font-medium">{errors.gradeId.message}</p>
                    )}
                  </div>

                  {/* Section */}
                  <div className="space-y-2">
                    <label htmlFor="sectionId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Section *
                    </label>
                    <select
                      id="sectionId"
                      disabled={!selectedGradeId || loadingSections}
                      {...register("sectionId")}
                      className={`w-full h-11 px-3 rounded-xl border bg-card text-foreground text-sm cursor-pointer disabled:opacity-50 disabled:bg-muted/40 disabled:cursor-not-allowed ${
                        errors.sectionId ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                      }`}
                    >
                      <option value="">
                        {!selectedGradeId
                          ? "Select a Grade first"
                          : loadingSections
                          ? "Loading sections..."
                          : "Select Section"}
                      </option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id.toString()}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.sectionId && (
                      <p className="text-xs text-red-500 font-medium">{errors.sectionId.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Student Information */}
              <div className="space-y-4 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">2. Personal Information</h3>

                {/* LRN Input with Mono font */}
                <div className="space-y-2">
                  <label htmlFor="lrn" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Learner Reference Number (LRN) *
                  </label>
                  <input
                    id="lrn"
                    type="text"
                    maxLength={12}
                    placeholder="12-digit number"
                    {...register("lrn")}
                    className={`w-full h-11 px-4 rounded-xl border bg-card font-mono text-sm tracking-widest ${
                      errors.lrn ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                    }`}
                  />
                  
                  {/* Hard validation error */}
                  {errors.lrn && (
                    <p className="text-xs text-red-500 font-medium">{errors.lrn.message}</p>
                  )}
                  
                  {/* Soft non-numeric warning */}
                  {isLrnNonNumeric && !errors.lrn && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-2.5 rounded-lg">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Warning: LRN should normally contain only numbers.</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      First Name *
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      placeholder="First name"
                      {...register("first_name")}
                      className={`w-full h-11 px-4 rounded-xl border bg-card text-sm ${
                        errors.first_name ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                      }`}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500 font-medium">{errors.first_name.message}</p>
                    )}
                  </div>

                  {/* Middle Name */}
                  <div className="space-y-2">
                    <label htmlFor="middle_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Middle Name
                    </label>
                    <input
                      id="middle_name"
                      type="text"
                      placeholder="Middle name"
                      {...register("middle_name")}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Last Name *
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      placeholder="Last name"
                      {...register("last_name")}
                      className={`w-full h-11 px-4 rounded-xl border bg-card text-sm ${
                        errors.last_name ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                      }`}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500 font-medium">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Birthday */}
                  <div className="space-y-2">
                    <label htmlFor="birthday" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date of Birth *
                    </label>
                    <input
                      id="birthday"
                      type="date"
                      {...register("birthday")}
                      className={`w-full h-11 px-4 rounded-xl border bg-card text-sm ${
                        errors.birthday ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                      }`}
                    />
                    {errors.birthday && (
                      <p className="text-xs text-red-500 font-medium">{errors.birthday.message}</p>
                    )}
                  </div>

                  {/* Birthplace */}
                  <div className="space-y-2">
                    <label htmlFor="birthplace" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Place of Birth
                    </label>
                    <input
                      id="birthplace"
                      type="text"
                      placeholder="City/Municipality, Province"
                      {...register("birthplace")}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                    />
                  </div>
                </div>

                {/* Residential Address */}
                <div className="space-y-2">
                  <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Residential Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Complete home address"
                    {...register("address")}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                  />
                </div>
              </div>

              {/* SECTION 3: Family Contact */}
              <div className="space-y-4 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">3. Family & Contact details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Father's name */}
                  <div className="space-y-2">
                    <label htmlFor="father_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Father&apos;s Full Name
                    </label>
                    <input
                      id="father_name"
                      type="text"
                      placeholder="Father's name"
                      {...register("father_name")}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                    />
                  </div>

                  {/* Mother's name */}
                  <div className="space-y-2">
                    <label htmlFor="mother_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mother&apos;s Full Name
                    </label>
                    <input
                      id="mother_name"
                      type="text"
                      placeholder="Mother's name"
                      {...register("mother_name")}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                    />
                  </div>

                  {/* Guardian's name */}
                  <div className="space-y-2">
                    <label htmlFor="guardian_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Guardian&apos;s Full Name
                    </label>
                    <input
                      id="guardian_name"
                      type="text"
                      placeholder="Guardian's name"
                      {...register("guardian_name")}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label htmlFor="contact_number" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Primary Contact Number
                  </label>
                  <input
                    id="contact_number"
                    type="text"
                    placeholder="Mobile or landline number"
                    {...register("contact_number")}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm"
                  />
                  
                  {/* Contact Number soft warning */}
                  {isContactEmpty && (
                    <p className="text-xs text-amber-500 font-medium">
                      ⚠️ Warning: Contact number is recommended for communication.
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 4: Status and Remarks */}
              <div className="space-y-4 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">4. Status</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Student Status *
                    </label>
                    <select
                      id="status"
                      {...register("status")}
                      className={`w-full h-11 px-3 rounded-xl border bg-card text-foreground text-sm cursor-pointer ${
                        errors.status ? "border-red-500 ring-4 ring-red-500/10" : "border-border"
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Transferred">Transferred</option>
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <label htmlFor="remarks" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Remarks / Notes
                    </label>
                    <textarea
                      id="remarks"
                      rows={1}
                      placeholder="Notes regarding student status or history"
                      {...register("remarks")}
                      className="w-full min-h-[44px] max-h-[120px] p-3 rounded-xl border border-border bg-card text-foreground text-sm focus:ring-4 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Actions Footer */}
            <CardFooter className="flex items-center justify-end gap-3">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting} className="flex items-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving records...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Student
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      {/* Discard changes dialog */}
      <Dialog
        isOpen={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        title="Discard unsaved changes?"
        description="Are you sure you want to navigate away? Any changes you have made to this form will be permanently lost."
        confirmLabel="Discard"
        cancelLabel="Stay"
        onConfirm={handleDiscard}
      />
    </>
  );
}

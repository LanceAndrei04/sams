"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ALL_GRADES } from "@/lib/students/grade-groups";
import {
  getGradesForActiveYear,
  getSectionsByGrade,
  getStudentById,
  createStudent,
  updateStudent,
  checkLRNUnique,
  Student,
} from "@/lib/supabase/students";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";

// Form validation schema
const studentSchema = z.object({
  section_id: z.string().min(1, "Section is required"),
  lrn: z.string()
    .min(1, "LRN is required")
    .min(12, "LRN must be at least 12 digits")
    .max(12, "LRN must be at most 12 digits")
    .regex(/^\d+$/, "LRN must contain only numbers"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  birthday: z.date({
    error: "Birthday is required",
  }),
  birthplace: z.string().optional(),
  address: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  guardian_name: z.string().optional(),
  contact_number: z.string().optional(),
  remarks: z.string().optional(),
  status: z.enum(["active", "inactive", "transferred"]),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  mode: "add" | "edit";
  studentId?: string;
}

export default function StudentForm({ mode, studentId }: StudentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: "active",
    },
  });

  // Get initial grade ID from URL params for add mode
  useEffect(() => {
    if (mode === "add") {
      const gradeParam = searchParams.get("gradeId");
      if (gradeParam) {
        setSelectedGradeId(gradeParam);
      }
    }
  }, [mode, searchParams]);

  // Load grades and sections
  useEffect(() => {
    async function loadGrades() {
      const dbGrades = await getGradesForActiveYear();
      setGrades(dbGrades);
    }
    loadGrades();
  }, []);

  // Load sections when grade is selected
  useEffect(() => {
    async function loadSections() {
      if (selectedGradeId) {
        const dbSections = await getSectionsByGrade(selectedGradeId);
        setSections(dbSections);
        
        // If there's only one section, auto-select it
        if (dbSections.length === 1 && !form.getValues("section_id")) {
          form.setValue("section_id", dbSections[0].id);
        }
      } else {
        setSections([]);
        form.setValue("section_id", "");
      }
    }
    loadSections();
  }, [selectedGradeId, form]);

  // Load student data for edit mode
  useEffect(() => {
    async function loadStudent() {
      if (mode === "edit" && studentId) {
        setIsLoading(true);
        try {
          const student = await getStudentById(studentId);
          if (student) {
            // Set grade from student's section
            const gradeId = student.section?.grade_id;
            if (gradeId) {
              setSelectedGradeId(gradeId);
            }

            // Set form values
            form.reset({
              section_id: student.section_id,
              lrn: student.lrn,
              first_name: student.first_name,
              last_name: student.last_name,
              middle_name: student.middle_name || "",
              birthday: new Date(student.birthday),
              birthplace: student.birthplace || "",
              address: student.address || "",
              father_name: student.father_name || "",
              mother_name: student.mother_name || "",
              guardian_name: student.guardian_name || "",
              contact_number: student.contact_number || "",
              remarks: student.remarks || "",
              status: student.status,
            });
          }
        } catch (error) {
          console.error("Error loading student:", error);
          toast.error("Failed to load student data");
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadStudent();
  }, [mode, studentId, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle grade selection
  const handleGradeSelect = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    form.setValue("section_id", ""); // Reset section when grade changes
  };

  // Form submission
  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);

    try {
      // Check LRN uniqueness
      const isUnique = await checkLRNUnique(
        data.lrn,
        mode === "edit" ? studentId : undefined
      );
      
      if (!isUnique) {
        form.setError("lrn", {
          type: "manual",
          message: "This LRN is already registered for another student",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare student data
      const studentData = {
        ...data,
        birthday: format(data.birthday, "yyyy-MM-dd"),
      };

      // Save student
      if (mode === "add") {
        await createStudent(studentData);
        toast.success("Student added successfully");
      } else if (mode === "edit" && studentId) {
        await updateStudent(studentId, studentData);
        toast.success("Student updated successfully");
      }

      // Redirect to student profile
      router.push(`/students/${studentId || "new"}`);
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (!confirm("Are you sure you want to discard changes?")) {
        return;
      }
    }
    router.push("/students");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "add" ? "Add New Student" : "Edit Student"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === "add" 
              ? "Fill in the student information below" 
              : "Update the student information below"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Enrollment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Enrollment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Grade</FormLabel>
                  <Select
                    value={selectedGradeId}
                    onValueChange={handleGradeSelect}
                    disabled={mode === "edit"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedGradeId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Please select a grade first
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="section_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedGradeId || sections.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Student Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Student Information
              </h3>
              
              <FormField
                control={form.control}
                name="lrn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LRN (Learner Reference Number)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12-digit number" 
                        {...field} 
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Required" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Required" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Birthday *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                           disabled={(date: Date) =>
  date > new Date() || date < new Date("1900-01-01")
}
initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthplace</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full address (optional)" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Family/Guardian Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Family / Guardian
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="father_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mother_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guardian_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Number
                      <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                        (Recommended)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+63XXXXXXXXXX" 
                        {...field} 
                      />
                    </FormControl>
                    {!field.value && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <AlertCircle className="inline w-3 h-3 mr-1" />
                        Providing a contact number is recommended for emergencies
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="transferred">Transferred</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes (optional)" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Student"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
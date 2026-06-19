// Student Profile Page (Stub)
// This is a stub page as requested - full design comes separately

"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, GraduationCap, User, Phone, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getStudentById } from "@/lib/supabase/students";
import { useEffect, useState } from "react";
import { StudentWithRelations } from "@/lib/supabase/students";
import { format } from "date-fns";
import DocumentsTab from "@/components/students/profile-tabs/documents-tab";

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<StudentWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      setIsLoading(true);
      try {
        const studentData = await getStudentById(studentId);
        setStudent(studentData);
      } catch (error) {
        console.error("Error loading student:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Student Not Found</h3>
          <p className="text-muted-foreground mb-6">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/students">Browse Students</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format student name
  const fullName = `${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`;
  const formattedBirthday = student.birthday ? format(new Date(student.birthday), "MMMM d, yyyy") : "N/A";

  // Status badge color
  let statusColor = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  switch (student.status) {
    case "active":
      statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      break;
    case "transferred":
      statusColor = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      break;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
              LRN: {student.lrn}
            </code>
            <Badge className={statusColor}>
              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={`/students/${student.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Student
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">LRN</p>
                  <p className="font-mono font-medium">{student.lrn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColor}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Enrollment Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Enrollment
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="font-medium">{student.section?.grade?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Section</p>
                  <p className="font-medium">{student.section?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Date</p>
                  <p className="font-medium">
                    {student.created_at ? format(new Date(student.created_at), "MMMM d, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact & Family
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p className="font-medium">{student.contact_number || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guardian</p>
                  <p className="font-medium">{student.guardian_name || student.mother_name || student.father_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{student.address || "Not provided"}</p>
                </div>
              </div>
            </Card>
          </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Personal Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Birthday</p>
              <p className="font-medium">{formattedBirthday}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Birthplace</p>
              <p className="font-medium">{student.birthplace || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Father's Name</p>
              <p className="font-medium">{student.father_name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mother's Name</p>
              <p className="font-medium">{student.mother_name || "Not provided"}</p>
            </div>
          </div>
        </Card>

        {/* Remarks */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Remarks & Notes
          </h3>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Additional Information</p>
            {student.remarks ? (
              <p className="text-foreground whitespace-pre-wrap">{student.remarks}</p>
            ) : (
              <p className="text-muted-foreground italic">No remarks provided</p>
            )}
          </div>
        </Card>
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Student Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Profile Management</h4>
            <p className="text-sm text-muted-foreground">
              Use the "Edit Student" button to update this student's information. Grade and Section cannot be changed after creation.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Data Privacy</h4>
            <p className="text-sm text-muted-foreground">
              Student information is protected under data privacy regulations. Access is restricted to authorized personnel only.
            </p>
          </div>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab studentId={student.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
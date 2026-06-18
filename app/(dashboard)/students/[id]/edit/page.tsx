// Edit Student Page
// Screen 3: Edit Student Form `/students/[id]/edit`

"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/students/student-form";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href={`/students/${studentId}`}
        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Student Profile
      </Link>

      {/* Page Content */}
      <div>
        <StudentForm mode="edit" studentId={studentId} />
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Editing Student Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Important Notes</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Grade and Section cannot be changed after creation</li>
              <li>• LRN changes require unique validation</li>
              <li>• Status changes will affect enrollment reports</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Data Integrity</h4>
            <p className="text-sm text-muted-foreground">
              All changes are logged in the system. Previous versions of student information can be reviewed by administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
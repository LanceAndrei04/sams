// Add Student Page
// Screen 3: Add Student Form `/students/add`

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/students/student-form";

export default function AddStudentPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/students"
        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Students
      </Link>

      {/* Page Content */}
      <div>
        <StudentForm mode="add" />
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Adding a New Student
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Required Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Grade and Section</li>
              <li>• 12-digit LRN (Learner Reference Number)</li>
              <li>• First and Last Name</li>
              <li>• Birthday</li>
              <li>• Student Status</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">LRN Validation</h4>
            <p className="text-sm text-muted-foreground">
              The LRN must be a unique 12-digit number. The system will check for duplicates before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
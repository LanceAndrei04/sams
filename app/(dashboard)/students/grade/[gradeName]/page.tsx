// Grade Roster Page
// Screen 2: Grade Roster `/students/grade/[gradeId]`

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentTable from "@/components/students/student-table";
import { getStudentsByGrade, getSectionsByGrade, getGradesForActiveYear } from "@/lib/supabase/students";
import { StudentWithRelations } from "@/lib/supabase/students";

export default function GradeRosterPage() {
  const params = useParams();
  const router = useRouter();
  const gradeName = decodeURIComponent(params.gradeName as string);
  
  const [students, setStudents] = useState<StudentWithRelations[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradeId, setGradeId] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Get all grades to find the ID for this grade name
        const grades = await getGradesForActiveYear();
        
        // Convert URL param back to grade name
        // gradeName is like "grade-3" or "kinder"
        let targetGradeName = gradeName
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        
        // Handle "Grade 3" format
        if (targetGradeName.includes("Grade")) {
          targetGradeName = targetGradeName.replace("grade", "Grade");
        }
        
        const targetGrade = grades.find(g => 
          g.name.toLowerCase() === targetGradeName.toLowerCase()
        );
        
        if (!targetGrade) {
          console.error("Grade not found:", gradeName, "converted to:", targetGradeName);
          return;
        }
        
        setGradeId(targetGrade.id);
        
        // Get students for this grade
        const gradeStudents = await getStudentsByGrade(targetGrade.id);
        setStudents(gradeStudents);
        
        // Get sections for this grade
        const gradeSections = await getSectionsByGrade(targetGrade.id);
        setSections(gradeSections);
      } catch (error) {
        console.error("Error loading grade roster:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (gradeName) {
      loadData();
    }
  }, [gradeName]);

  // Format grade name for display (e.g., "grade-3" -> "Grade 3")
  const displayGradeName = gradeName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/students"
        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Grades
      </Link>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {displayGradeName} Roster
          </h1>
          <p className="text-muted-foreground">
            View and manage students in {displayGradeName}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
        <div className="text-sm">
          <span className="font-medium">{students.length} students</span>
          <span className="text-muted-foreground ml-2">
            in {sections.length} sections
          </span>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // In a real app, this would open an import modal
              console.log("Import students");
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Students
          </Button>
          <Button
            size="sm"
            onClick={() => {
              router.push(`/students/add?gradeId=${gradeId}`);
            }}
            disabled={!gradeId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Student Table */}
      <StudentTable
        students={students}
        sections={sections}
        isLoading={isLoading}
      />

      {/* Empty State Help */}
      {!isLoading && students.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">👨‍🎓</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Students in {displayGradeName} Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding the first student to this grade.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                router.push(`/students/add?gradeId=${gradeId}`);
              }}
              disabled={!gradeId}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Student
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would open an import modal
                console.log("Import students");
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from Spreadsheet
            </Button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Managing {displayGradeName} Students
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Filter by Section</h4>
            <p className="text-sm text-muted-foreground">
              Use the section dropdown to view students from specific sections within this grade.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Search Within Grade</h4>
            <p className="text-sm text-muted-foreground">
              Search for specific students by name or LRN within this grade using the search bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Student Landing Page - Grade Card Grid
// Screen 1: Student Landing — Grade Card Grid `/students`

import { GraduationCap } from "lucide-react";
import QuickSearch from "@/components/students/quick-search";
import GradeCardGrid from "@/components/students/grade-card-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground">
              Manage student records, sections, and enrollment
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/students/add">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Link>
        </Button>
      </div>

      {/* Quick Search Bar */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Quick Search
        </label>
        <p className="text-sm text-muted-foreground">
          Search for any student across all grades in the active school year
        </p>
        <QuickSearch />
      </div>

      {/* Grade Card Grid */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Browse by Grade Level
        </h2>
        <p className="text-sm text-muted-foreground">
          Click on a grade card to view its student roster
        </p>
        <GradeCardGrid />
      </div>

      {/* Help Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Need Help with Student Management?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Adding Students</h4>
            <p className="text-sm text-muted-foreground">
              Use the "Add Student" button above or navigate to a specific grade and add students from there.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Quick Search</h4>
            <p className="text-sm text-muted-foreground">
              Search for any student by LRN or name using the search bar above. Results appear instantly.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Grade Navigation</h4>
            <p className="text-sm text-muted-foreground">
              Grades are grouped by educational stage: Pre-School, Primary, and Intermediate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
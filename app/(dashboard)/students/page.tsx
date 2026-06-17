// Students page - placeholder for testing navigation
// This is a blank page as requested for UI testing

import { GraduationCap } from "lucide-react";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Students</h2>
            <p className="text-muted-foreground">
              Student roster and management
            </p>
          </div>
        </div>
      </div>
      
      {/* Placeholder content for testing UI */}
      <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
        <div className="text-4xl mb-4">🎓</div>
        <h3 className="text-lg font-medium text-foreground mb-2">Students Management</h3>
        <p className="text-muted-foreground">
          This is a placeholder page for testing the students navigation.
          <br />
          No functional content has been added as requested.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
        </div>
      </div>
      
      {/* Placeholder table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Teachers page - placeholder for testing navigation
// This is a blank page as requested for UI testing

import { Users } from "lucide-react";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Teachers</h2>
            <p className="text-muted-foreground">
              Teacher directory and information
            </p>
          </div>
        </div>
      </div>
      
      {/* Placeholder content for testing UI */}
      <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
        <div className="text-4xl mb-4">👩‍🏫</div>
        <h3 className="text-lg font-medium text-foreground mb-2">Teachers Directory</h3>
        <p className="text-muted-foreground">
          This is a placeholder page for testing the teachers navigation.
          <br />
          No functional content has been added as requested.
        </p>
      </div>
      
      {/* Placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <div
            key={card}
            className="p-6 border border-border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-4/6" />
            </div>
            <div className="pt-4 border-t border-border flex gap-2">
              <div className="h-8 flex-1 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
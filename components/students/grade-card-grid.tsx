"use client";

import GradeCard from "./grade-card";
import { getGradesByGroup } from "@/lib/students/grade-groups";

// Dummy data for grade student counts
const DUMMY_STUDENT_COUNTS: Record<string, number> = {
  'Kinder': 45,
  'Grade 1': 68,
  'Grade 2': 72,
  'Grade 3': 81,
  'Grade 4': 75,
  'Grade 5': 69,
  'Grade 6': 63,
};

export default function GradeCardGrid() {
  // Get grades organized by group
  const gradesByGroup = getGradesByGroup();

  return (
    <div className="space-y-8">
      {Object.entries(gradesByGroup).map(([group, gradeList]) => (
        <div key={group} className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">{group}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gradeList.map((grade) => (
              <GradeCard
                key={grade}
                gradeName={grade}
                studentCount={DUMMY_STUDENT_COUNTS[grade] || 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
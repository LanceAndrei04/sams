// Hardcoded grade groups for display-only purposes
// This does NOT exist in the database

export const GRADE_GROUPS: Record<string, string> = {
  "Kinder": "Pre-School",
  "Grade 1": "Primary",
  "Grade 2": "Primary",
  "Grade 3": "Primary",
  "Grade 4": "Intermediate",
  "Grade 5": "Intermediate",
  "Grade 6": "Intermediate",
};

// Array of all grades in display order
export const ALL_GRADES = [
  "Kinder",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
];

// Helper function to get group for a grade
export function getGroupForGrade(grade: string): string {
  return GRADE_GROUPS[grade] || "Other";
}

// Helper function to get grades by group
export function getGradesByGroup(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  
  for (const [grade, group] of Object.entries(GRADE_GROUPS)) {
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(grade);
  }
  
  return result;
}
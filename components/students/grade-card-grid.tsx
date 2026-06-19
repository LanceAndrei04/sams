"use client";

import { useState, useEffect } from "react";
import GradeCard from "./grade-card";
import { getGradesByGroup } from "@/lib/students/grade-groups";
import { getStudentCountsByGrade } from "@/lib/supabase/students";

export default function GradeCardGrid() {
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudentCounts() {
      console.log("[GradeCardGrid] Starting to load student counts...");
      try {
        const counts = await getStudentCountsByGrade();
        console.log("[GradeCardGrid] Student counts loaded:", counts);
        setStudentCounts(counts);
      } catch (error) {
        console.error("[GradeCardGrid] Failed to load student counts:", error);
      } finally {
        console.log("[GradeCardGrid] Loading complete, setting isLoading to false");
        setIsLoading(false);
      }
    }
    loadStudentCounts();
  }, []);

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
                studentCount={isLoading ? 0 : (studentCounts[grade] || 0)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Grade, Section } from "@/lib/supabase/students";

interface StudentTableFiltersProps {
  searchValue: string;
  selectedGrade: string;
  selectedSection: string;
  sections: Section[];
  grades: Grade[];
  loadingSections: boolean;
  onSearchChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onSectionChange: (value: string) => void;
}

export default function StudentTableFilters({
  searchValue,
  selectedGrade,
  selectedSection,
  sections,
  grades,
  loadingSections,
  onSearchChange,
  onGradeChange,
  onSectionChange,
}: StudentTableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </span>
        <input
          type="text"
          placeholder="Search LRN, first name, last name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-foreground text-sm"
        />
      </div>

      <div className="relative">
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm appearance-none cursor-pointer focus:ring-4 focus:ring-primary/20"
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id.toString()}>
              {grade.name}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground/60">
          <SlidersHorizontal className="w-4 h-4" />
        </span>
      </div>

      <div className="relative">
        <select
          value={selectedSection}
          disabled={!selectedGrade || loadingSections}
          onChange={(e) => onSectionChange(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm disabled:opacity-50 disabled:bg-muted/40 disabled:cursor-not-allowed appearance-none cursor-pointer focus:ring-4 focus:ring-primary/20"
        >
          <option value="">
            {!selectedGrade ? "Select a Grade first" : loadingSections ? "Loading..." : "All Sections"}
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.id.toString()}>
              {section.name}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground/60">
          <SlidersHorizontal className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

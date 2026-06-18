"use client";

import { useRouter } from "next/navigation";
import { type Table } from "@tanstack/react-table";
import {
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grade, Section, StudentWithRelations } from "@/lib/supabase/students";
import StudentTableFilters from "./student-table-filters";
import { flexRender } from "@tanstack/react-table";

interface StudentTableViewProps {
  initialGrades: Grade[];
  sections: Section[];
  loadingSections: boolean;
  selectedGrade: string;
  selectedSection: string;
  searchValue: string;
  filteredStudents: StudentWithRelations[];
  table: Table<StudentWithRelations>;
  onSearchChangeAction: (value: string) => void;
  onGradeChangeAction: (value: string) => void;
  onSectionChangeAction: (value: string) => void;
  onImportClickAction: () => void;
}

export default function StudentTableView({
  initialGrades,
  sections,
  loadingSections,
  selectedGrade,
  selectedSection,
  searchValue,
  filteredStudents,
  table,
  onSearchChangeAction,
  onGradeChangeAction,
  onSectionChangeAction,
  onImportClickAction,
}: StudentTableViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Students</h2>
          <p className="text-sm text-muted-foreground">
            Displaying {filteredStudents.length} registered students in active sections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={onImportClickAction}>
            <Download className="w-4 h-4" />
            Import Students
          </Button>
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => router.push("/students/add")}> 
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      <StudentTableFilters
        searchValue={searchValue}
        selectedGrade={selectedGrade}
        selectedSection={selectedSection}
        sections={sections}
        grades={initialGrades}
        loadingSections={loadingSections}
        onSearchChange={onSearchChangeAction}
        onGradeChange={onGradeChangeAction}
        onSectionChange={onSectionChangeAction}
      />

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-3xl">
            🎓
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {selectedSection ? "No students found in this section yet" : "No students found"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            {selectedSection
              ? "There are currently no students enrolled in this specific section. Let's register a new student!"
              : "No students match the current filters or search query."}
          </p>
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => router.push("/students/add")}
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/40 border-b border-border/60">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`p-4 font-semibold text-muted-foreground select-none cursor-pointer hover:bg-muted/65 transition-colors ${
                            header.column.getCanSort() ? "relative" : ""
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" && " 🔼"}
                            {header.column.getIsSorted() === "desc" && " 🔽"}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-border/65">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => router.push(`/students/${row.original.id}`)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors focus-within:bg-muted/40"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border rounded-xl bg-card">
            <div className="text-xs text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredStudents.length
                )}
              </span>{' '}
              of <span className="font-semibold text-foreground">{filteredStudents.length}</span> students
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-foreground px-2 font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

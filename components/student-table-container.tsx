"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Grade,
  Section,
  StudentWithRelations,
  getSectionsByGrade,
} from "@/lib/supabase/students";
import { toast } from "sonner";

interface StudentTableContainerProps {
  initialStudents: StudentWithRelations[];
  initialGrades: Grade[];
}

export default function StudentTableContainer({
  initialStudents,
  initialGrades,
}: StudentTableContainerProps) {
  const router = useRouter();
  
  // State for raw data
  const [students] = useState<StudentWithRelations[]>(initialStudents);
  
  // Filtering states
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  
  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Table sorting and pagination state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "last_name", desc: false }, // Default sort Last Name ASC
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25, // Default 25 rows per page
  });

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // Load selected Grade from sessionStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedGrade = sessionStorage.getItem("sams_student_filter_grade");
      if (persistedGrade) {
        setSelectedGrade(persistedGrade);
        const persistedSection = sessionStorage.getItem("sams_student_filter_section");
        // Load sections for that grade
        setLoadingSections(true);
        getSectionsByGrade(Number(persistedGrade))
          .then((res) => {
            setSections(res);
            if (persistedSection && res.some((s) => s.id === Number(persistedSection))) {
              setSelectedSection(persistedSection);
            }
          })
          .catch(() => {
            toast.error("Failed to load sections.");
          })
          .finally(() => {
            setLoadingSections(false);
          });
      }
    }
  }, []);

  // Update sections when grade changes
  const handleGradeChange = async (gradeIdStr: string) => {
    setSelectedGrade(gradeIdStr);
    setSelectedSection(""); // Reset section
    setSections([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    if (typeof window !== "undefined") {
      if (gradeIdStr) {
        sessionStorage.setItem("sams_student_filter_grade", gradeIdStr);
        sessionStorage.removeItem("sams_student_filter_section");
      } else {
        sessionStorage.removeItem("sams_student_filter_grade");
        sessionStorage.removeItem("sams_student_filter_section");
      }
    }

    if (!gradeIdStr) return;

    try {
      setLoadingSections(true);
      const res = await getSectionsByGrade(Number(gradeIdStr));
      setSections(res);
    } catch {
      toast.error("Failed to load sections.");
    } finally {
      setLoadingSections(false);
    }
  };

  // Handle section changes
  const handleSectionChange = (sectionIdStr: string) => {
    setSelectedSection(sectionIdStr);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    if (typeof window !== "undefined") {
      if (sectionIdStr) {
        sessionStorage.setItem("sams_student_filter_section", sectionIdStr);
      } else {
        sessionStorage.removeItem("sams_student_filter_section");
      }
    }
  };

  // Filter students based on all states in memory (fast & responsive)
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      // 1. Grade filter
      if (selectedGrade && student.section.grade.id !== Number(selectedGrade)) {
        return false;
      }
      // 2. Section filter
      if (selectedSection && student.section_id !== Number(selectedSection)) {
        return false;
      }
      // 3. Search query filter
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesLrn = student.lrn.toLowerCase().includes(query);
        const matchesFirstName = student.first_name.toLowerCase().includes(query);
        const matchesLastName = student.last_name.toLowerCase().includes(query);
        const matchesMiddleName = student.middle_name
          ? student.middle_name.toLowerCase().includes(query)
          : false;

        if (!matchesLrn && !matchesFirstName && !matchesLastName && !matchesMiddleName) {
          return false;
        }
      }
      return true;
    });
  }, [students, selectedGrade, selectedSection, debouncedSearch]);

  // Handle Import Students click
  const handleImport = () => {
    toast.info("Import Roster Feature", {
      description: "Bulk enrollment import feature will be available in a future release.",
    });
  };

  // Column definitions
  const columns = React.useMemo<ColumnDef<StudentWithRelations>[]>(
    () => [
      {
        accessorKey: "last_name",
        header: "Name",
        cell: (info) => {
          const row = info.row.original;
          const middleInitial = row.middle_name ? ` ${row.middle_name.charAt(0)}.` : "";
          return (
            <span className="font-semibold text-foreground">
              {row.last_name}, {row.first_name}
              {middleInitial}
            </span>
          );
        },
      },
      {
        accessorKey: "lrn",
        header: "LRN",
        cell: (info) => (
          <code className="font-mono text-sm tracking-wide bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
            {info.getValue() as string}
          </code>
        ),
      },
      {
        id: "grade",
        header: "Grade",
        accessorFn: (row) => row.section.grade.name,
      },
      {
        id: "section",
        header: "Section",
        accessorFn: (row) => row.section.name,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as "Active" | "Inactive" | "Transferred";
          const variantMap = {
            Active: "active" as const,
            Inactive: "inactive" as const,
            Transferred: "transferred" as const,
          };
          return <Badge variant={variantMap[status]}>{status}</Badge>;
        },
      },
      {
        accessorKey: "contact_number",
        header: "Contact",
        cell: (info) => (info.getValue() ? (info.getValue() as string) : <span className="text-muted-foreground/50 text-xs">—</span>),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const student = info.row.original;
          return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`View profile of ${student.first_name}`}
                onClick={() => router.push(`/students/${student.id}`)}
              >
                <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Edit details of ${student.first_name}`}
                onClick={() => router.push(`/students/${student.id}/edit`)}
              >
                <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          );
        },
      },
    ],
    [router]
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Table rendering elements
  return (
    <div className="space-y-6">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Students</h2>
          <p className="text-sm text-muted-foreground">
            Displaying {filteredStudents.length} registered students in active sections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleImport}>
            <Download className="w-4 h-4" />
            Import Students
          </Button>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => router.push("/students/add")}>
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters & Search bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </span>
          <input
            type="text"
            placeholder="Search LRN, first name, last name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-foreground text-sm"
          />
        </div>

        {/* Grade Filter */}
        <div className="relative">
          <select
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm appearance-none cursor-pointer focus:ring-4 focus:ring-primary/20"
          >
            <option value="">All Grades</option>
            {initialGrades.map((grade) => (
              <option key={grade.id} value={grade.id.toString()}>
                {grade.name}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground/60">
            <SlidersHorizontal className="w-4 h-4" />
          </span>
        </div>

        {/* Section Filter */}
        <div className="relative">
          <select
            value={selectedSection}
            disabled={!selectedGrade || loadingSections}
            onChange={(e) => handleSectionChange(e.target.value)}
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

      {/* Student Table */}
      {filteredStudents.length === 0 ? (
        // Empty State
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
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => {
              // Pre-populate grade/section to create form if we can
              router.push("/students/add");
            }}
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      ) : (
        // Table View
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

          {/* Pagination Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border rounded-xl bg-card">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredStudents.length
                )}
              </span>{" "}
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

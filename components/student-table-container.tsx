"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Grade,
  Section,
  StudentWithRelations,
  getSectionsByGrade,
} from "@/lib/supabase/students";
import { toast } from "sonner";
import StudentTableView from "@/components/students/student-table-view";
import { getStudentTableColumns } from "@/components/students/student-table-columns";

interface StudentTableContainerProps {
  initialStudents: StudentWithRelations[];
  initialGrades: Grade[];
}

export default function StudentTableContainer({
  initialStudents,
  initialGrades,
}: StudentTableContainerProps) {
  const router = useRouter();
  const [students] = useState<StudentWithRelations[]>(initialStudents);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "last_name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedGrade = sessionStorage.getItem("sams_student_filter_grade");
      if (persistedGrade) {
        setSelectedGrade(persistedGrade);
        const persistedSection = sessionStorage.getItem("sams_student_filter_section");

        setLoadingSections(true);
        getSectionsByGrade(persistedGrade)
          .then((res) => {
            setSections(res);
            if (persistedSection && res.some((s) => s.id === persistedSection)) {
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

  const handleGradeChange = async (gradeIdStr: string) => {
    setSelectedGrade(gradeIdStr);
    setSelectedSection("");
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

    if (!gradeIdStr) {
      return;
    }

    try {
      setLoadingSections(true);
      const res = await getSectionsByGrade(gradeIdStr);
      setSections(res);
    } catch {
      toast.error("Failed to load sections.");
    } finally {
      setLoadingSections(false);
    }
  };

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

  const filteredStudents = React.useMemo(
    () =>
      students.filter((student) => {
        if (selectedGrade && student.grade.id !== selectedGrade) {
          return false;
        }

        if (selectedSection && student.section_id !== selectedSection) {
          return false;
        }

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
      }),
    [students, selectedGrade, selectedSection, debouncedSearch]
  );

  const handleImport = () => {
    toast.info("Import Roster Feature", {
      description: "Bulk enrollment import feature will be available in a future release.",
    });
  };

  const table = useReactTable({
    data: filteredStudents,
    columns: getStudentTableColumns(router),
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

  return (
    <StudentTableView
      initialGrades={initialGrades}
      sections={sections}
      loadingSections={loadingSections}
      selectedGrade={selectedGrade}
      selectedSection={selectedSection}
      searchValue={searchValue}
      filteredStudents={filteredStudents}
      table={table}
      onSearchChangeAction={setSearchValue}
      onGradeChangeAction={handleGradeChange}
      onSectionChangeAction={handleSectionChange}
      onImportClickAction={handleImport}
    />
  );
}

"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { StudentWithRelations } from "@/lib/supabase/students";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Search, Eye, Pencil } from "lucide-react";

interface StudentTableProps {
  students: StudentWithRelations[];
  sections: { id: string; name: string }[];
  isLoading?: boolean;
}

// Define columns inline to ensure they're always available
const getTableColumns = (router: ReturnType<typeof useRouter>): ColumnDef<StudentWithRelations>[] => [
  {
    accessorKey: "last_name",
    header: "Name",
    cell: (info) => {
      const row = info.row.original;
      const middleInitial = row.middle_name ? ` ${row.middle_name.charAt(0)}.` : "";
      return (
        <span className="font-semibold text-foreground">
          {row.last_name}, {row.first_name}{middleInitial}
        </span>
      );
    },
  },
  {
    accessorKey: "lrn",
    header: "LRN",
    cell: (info) => (
      <code className="font-mono text-sm tracking-wide bg-muted/50 px-1.5 py-0.5 rounded">
        {info.getValue() as string}
      </code>
    ),
  },
  {
    id: "grade",
    header: "Grade",
    accessorFn: (row) => row.grade?.name || "N/A",
  },
  {
    id: "section",
    header: "Section",
    accessorFn: (row) => row.section?.name || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue()).toLowerCase() as StudentWithRelations['status'];
      const variantMap = {
        active: "active" as const,
        inactive: "inactive" as const,
        transferred: "transferred" as const,
      };
      return (
        <Badge variant={variantMap[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contact_number",
    header: "Contact",
    cell: (info) => info.getValue() || "—",
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
];

export default function StudentTable({
  students,
  sections,
  isLoading = false,
}: StudentTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredStudents = students.filter((student) => {
    if (sectionFilter !== "all" && student.section_id !== sectionFilter) {
      return false;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${student.first_name} ${student.last_name} ${student.middle_name || ""}`.toLowerCase();
      const lrn = student.lrn.toLowerCase();
      
      return fullName.includes(searchLower) || lrn.includes(searchLower);
    }

    return true;
  });

  const tableColumns = getTableColumns(router);
  const table = useReactTable({
    data: filteredStudents,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
        <p className="text-muted-foreground mb-6">
          No students have been added to this grade yet.
        </p>
        <Button>Add Student</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search within this grade..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredStudents.length} of {students.length} students
        {sectionFilter !== "all" && " in selected section"}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-white/80"
                  onClick={() => {
                    window.location.href = `/students/${row.original.id}`;
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  {filteredStudents.length === 0 && students.length > 0 ? (
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No students match your filters
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No students found
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
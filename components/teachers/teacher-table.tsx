"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Teacher } from "@/lib/supabase/teachers";
import { teacherColumns } from "./columns";

export function TeacherTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>{Array.from({ length: 6 }).map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-24" /></TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, row) => (
            <TableRow key={row}>
              {Array.from({ length: 6 }).map((_, cell) => <TableCell key={cell}><Skeleton className="h-5 w-full" /></TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function TeacherTable({ teachers }: { teachers: Teacher[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "last_name", desc: false }]);
  const table = useReactTable({
    data: teachers,
    columns: teacherColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/teachers/${row.original.id}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {table.getPageCount() > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft data-icon="inline-start" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

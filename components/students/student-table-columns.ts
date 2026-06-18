"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AppRouterInstance } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { StudentWithRelations } from "@/lib/supabase/students";

export function getStudentTableColumns(router: AppRouterInstance): ColumnDef<StudentWithRelations>[] {
  return [
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
      cell: (info) =>
        info.getValue() ? (
          info.getValue() as string
        ) : (
          <span className="text-muted-foreground/50 text-xs">—</span>
        ),
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
}

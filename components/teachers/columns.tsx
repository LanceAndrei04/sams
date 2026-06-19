"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Teacher } from "@/lib/supabase/teachers";
import { formatTeacherName, getTeacherInitials, TeacherItemStatusBadge } from "./teacher-display";

export const teacherColumns: ColumnDef<Teacher>[] = [
  {
    id: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <Avatar className="size-8">
          {teacher.photo_url ? <AvatarImage src={teacher.photo_url} alt={formatTeacherName(teacher)} /> : null}
          <AvatarFallback>{getTeacherInitials(teacher)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "last_name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{formatTeacherName(row.original)}</span>,
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => row.original.designation || "-",
  },
  {
    accessorKey: "employee_number",
    header: "Employee #",
  },
  {
    accessorKey: "item_status",
    header: "Status",
    cell: ({ row }) => <TeacherItemStatusBadge status={row.original.item_status} />,
  },
  {
    accessorKey: "cellphone_number",
    header: "Contact",
    cell: ({ row }) => row.original.cellphone_number || "-",
  },
];

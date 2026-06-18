// Column definitions for the student data table
// Uses @tanstack/react-table

import { ColumnDef } from "@tanstack/react-table";
import { StudentWithRelations } from "@/lib/supabase/students";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<StudentWithRelations>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const student = row.original;
      const lastName = student.last_name || "";
      const firstName = student.first_name || "";
      const middleName = student.middle_name || "";
      
      return (
        <div className="font-medium">
          {lastName}, {firstName} {middleName ? `${middleName.charAt(0)}.` : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "lrn",
    header: "LRN",
    cell: ({ row }) => {
      const lrn = row.getValue("lrn") as string;
      return <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{lrn}</code>;
    },
  },
  {
    accessorKey: "section.name",
    header: "Section",
    cell: ({ row }) => {
      const section = row.original.section?.name || "N/A";
      return <div>{section}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let variant: "default" | "secondary" | "outline" = "default";
      let textColor = "";
      
      switch (status) {
        case "active":
          variant = "default";
          textColor = "text-green-700 dark:text-green-300";
          break;
        case "inactive":
          variant = "secondary";
          textColor = "text-gray-600 dark:text-gray-400";
          break;
        case "transferred":
          variant = "outline";
          textColor = "text-amber-700 dark:text-amber-300";
          break;
      }
      
      return (
        <Badge variant={variant} className={textColor}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contact_number",
    header: "Contact",
    cell: ({ row }) => {
      const contact = row.getValue("contact_number") as string;
      return <div>{contact || "N/A"}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original;
      
      return (
        <div className="flex gap-2">
          <Link
            href={`/students/${student.id}`}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="View student"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link
            href={`/students/${student.id}/edit`}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Edit student"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      );
    },
  },
];
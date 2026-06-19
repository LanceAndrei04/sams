import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Teacher, TeacherItemStatus } from "@/lib/supabase/teachers";

const itemStatusLabels: Record<TeacherItemStatus, string> = {
  own_station: "Own Station",
  reassigned: "Reassigned",
  borrowed: "Borrowed",
  clustered: "Clustered",
};

const itemStatusVariants: Record<TeacherItemStatus, BadgeProps["variant"]> = {
  own_station: "own_station",
  reassigned: "reassigned",
  borrowed: "borrowed",
  clustered: "clustered",
};

export function getTeacherInitials(teacher: Pick<Teacher, "first_name" | "last_name">) {
  return `${teacher.first_name?.[0] ?? ""}${teacher.last_name?.[0] ?? ""}`.toUpperCase() || "T";
}

export function formatTeacherName(teacher: Pick<Teacher, "first_name" | "last_name">) {
  return `${teacher.last_name}, ${teacher.first_name}`;
}

export function formatTeacherValue(value?: string | null) {
  return value?.trim() ? value : "-";
}

export function formatTeacherAddress(teacher: Pick<Teacher, "street" | "barangay" | "town" | "province">) {
  const parts = [teacher.street, teacher.barangay, teacher.town, teacher.province].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

export function TeacherItemStatusBadge({ status }: { status: TeacherItemStatus }) {
  return <Badge variant={itemStatusVariants[status]}>{itemStatusLabels[status]}</Badge>;
}

export { itemStatusLabels };

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Teacher } from "@/lib/supabase/teachers";
import { cn } from "@/lib/utils";
import { getTeacherInitials, TeacherItemStatusBadge } from "./teacher-display";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const initials = getTeacherInitials(teacher);

  return (
    <Link href={`/teachers/${teacher.id}`}>
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
          "flex flex-col items-center justify-center p-6 text-center"
        )}
      >
        <CardContent className="flex flex-col items-center gap-4 p-0">
          {/* Avatar */}
          <Avatar className="h-20 w-20">
            {teacher.photo_url ? (
              <AvatarImage src={teacher.photo_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
            ) : null}
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <div className="space-y-1">
            <h3 className="font-bold text-lg">
              {teacher.last_name}, {teacher.first_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {teacher.designation}
            </p>
          </div>

          {/* Status Badge */}
          <TeacherItemStatusBadge status={teacher.item_status} />
        </CardContent>
      </Card>
    </Link>
  );
}

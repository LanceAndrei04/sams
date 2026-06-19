import { Teacher } from "@/lib/supabase/teachers";
import TeacherCard from "./teacher-card";

interface TeacherCardGridProps {
  teachers: Teacher[];
}

export default function TeacherCardGrid({ teachers }: TeacherCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import TeacherForm from "@/components/teachers/teacher-form";
import { getTeacherById } from "@/lib/supabase/teachers";

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getTeacherById(id);

  if (!teacher) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Teacher not found.</h1>
        <Button asChild>
          <Link href="/teachers">Back to Teachers</Link>
        </Button>
      </div>
    );
  }

  return <TeacherForm teacher={teacher} />;
}

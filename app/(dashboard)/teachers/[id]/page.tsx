import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmploymentTab from "@/components/teachers/profile-tabs/employment-tab";
import PersonalInfoTab from "@/components/teachers/profile-tabs/personal-info-tab";
import TrainingHistoryTab from "@/components/teachers/profile-tabs/training-history-tab";
import { formatTeacherName, getTeacherInitials, TeacherItemStatusBadge } from "@/components/teachers/teacher-display";
import { getRecordsByTeacher } from "@/lib/supabase/teacher-yearly-records";
import { getTeacherById } from "@/lib/supabase/teachers";

export default async function TeacherProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [teacher, records] = await Promise.all([getTeacherById(id), getRecordsByTeacher(id)]);

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

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/teachers">
          <ArrowLeft data-icon="inline-start" />
          Back to Teachers
        </Link>
      </Button>

      <header className="flex flex-col gap-4 rounded-lg border bg-card p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-24">
            {teacher.photo_url ? <AvatarImage src={teacher.photo_url} alt={formatTeacherName(teacher)} /> : null}
            <AvatarFallback className="text-2xl">{getTeacherInitials(teacher)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{formatTeacherName(teacher)}</h1>
              <TeacherItemStatusBadge status={teacher.item_status} />
            </div>
            <p className="text-muted-foreground">{teacher.designation || "-"}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/teachers/${teacher.id}/edit`}>
            <Pencil data-icon="inline-start" />
            Edit
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="personal">
        <TabsList className="w-fit">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="training">Training & IPCRF</TabsTrigger>
        </TabsList>
        <TabsContent value="personal"><PersonalInfoTab teacher={teacher} /></TabsContent>
        <TabsContent value="employment"><EmploymentTab teacher={teacher} /></TabsContent>
        <TabsContent value="training"><TrainingHistoryTab records={records} /></TabsContent>
      </Tabs>
    </div>
  );
}

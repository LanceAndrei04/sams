export interface TeacherYearlyRecord {
  id: string;
  teacher_id: string;
  school_year_id: string;
  training_attended?: string | null;
  ipcrf_rating?: string | null;
  school_year: {
    id: string;
    label: string;
    is_active: boolean;
  };
}

const mockRecords: TeacherYearlyRecord[] = [
  {
    id: "1",
    teacher_id: "1",
    school_year_id: "2",
    training_attended: "Inclusive Education Workshop",
    ipcrf_rating: "Outstanding",
    school_year: { id: "2", label: "2025-2026", is_active: true },
  },
  {
    id: "2",
    teacher_id: "1",
    school_year_id: "1",
    training_attended: "Reading Intervention Seminar",
    ipcrf_rating: "Very Satisfactory",
    school_year: { id: "1", label: "2024-2025", is_active: false },
  },
  {
    id: "3",
    teacher_id: "2",
    school_year_id: "2",
    training_attended: "Numeracy Assessment Training",
    ipcrf_rating: "Very Satisfactory",
    school_year: { id: "2", label: "2025-2026", is_active: true },
  },
];

export async function getRecordsByTeacher(teacherId: string): Promise<TeacherYearlyRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockRecords
    .filter((record) => record.teacher_id === teacherId)
    .sort((a, b) => b.school_year.label.localeCompare(a.school_year.label));
}

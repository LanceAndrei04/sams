// Student data access layer -- queries Supabase directly

import { createClient } from "@/lib/supabase/client";

// --- Types -------------------------------------------------------------------

export interface SchoolYear {
  id: string;
  label: string;
  is_active: boolean;
}

export interface Grade {
  id: string;
  school_year_id: string;
  name: string;
}

export interface Section {
  id: string;
  grade_id: string;
  name: string;
}

export interface Student {
  id: string;
  section_id: string;
  lrn: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birthday: string;
  birthplace?: string;
  address?: string;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  contact_number?: string;
  remarks?: string;
  status: "active" | "inactive" | "transferred";
  created_at: string;
  section?: Section;
  grade?: Grade;
}

export interface StudentWithRelations extends Student {
  section?: Section;
  grade?: Grade;
}

// --- School Year -------------------------------------------------------------

/** Get the currently active school year */
export async function getActiveSchoolYear(): Promise<SchoolYear | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("school_years")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

// --- Grades ------------------------------------------------------------------

/** Get all grades for the active school year */
export async function getGradesForActiveYear(): Promise<Grade[]> {
  const supabase = createClient();
  const activeYear = await getActiveSchoolYear();
  if (!activeYear) return [];
  const { data } = await supabase
    .from("grades")
    .select("*")
    .eq("school_year_id", activeYear.id)
    .order("name");
  return data || [];
}

// --- Sections ----------------------------------------------------------------

/** Get all sections for a given grade */
export async function getSectionsByGrade(gradeId: string): Promise<Section[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("grade_id", gradeId)
    .order("name");
  return data || [];
}

// --- Student Counts ----------------------------------------------------------

/** Get student counts by grade name for the active school year */
export async function getStudentCountsByGrade(): Promise<Record<string, number>> {
  const supabase = createClient();
  const activeYear = await getActiveSchoolYear();
  if (!activeYear) return {};
  const { data: grades } = await supabase
    .from("grades")
    .select("id, name")
    .eq("school_year_id", activeYear.id);
  if (!grades || grades.length === 0) return {};
  const gradeMap = new Map(grades.map((g) => [g.id, g.name]));
  const { data: sections } = await supabase
    .from("sections")
    .select("id, grade_id")
    .in("grade_id", Array.from(gradeMap.keys()));
  if (!sections || sections.length === 0) {
    const empty: Record<string, number> = {};
    for (const g of grades) empty[g.name] = 0;
    return empty;
  }
  const sectionIds = sections.map((s) => s.id);
  const { data: studentCounts } = await supabase
    .from("students")
    .select("section_id")
    .in("section_id", sectionIds)
    .eq("status", "active");
  const sectionToGrade = new Map(sections.map((s) => [s.id, s.grade_id]));
  const counts: Record<string, number> = {};
  for (const g of grades) counts[g.name] = 0;
  for (const student of studentCounts || []) {
    const gradeId = sectionToGrade.get(student.section_id);
    const gradeName = gradeId ? gradeMap.get(gradeId) : undefined;
    if (gradeName) {
      counts[gradeName] = (counts[gradeName] || 0) + 1;
    }
  }
  return counts;
}

// --- Students ----------------------------------------------------------------

/** Get students by grade ID, sorted by last name */
export async function getStudentsByGrade(gradeId: string): Promise<StudentWithRelations[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("*, sections!inner(*, grades!inner(*))")
    .eq("sections.grade_id", gradeId)
    .order("last_name");
  return (data || []).map(normalizeStudent);
}

/** Search for active students by name or LRN */
export async function searchStudents(query: string): Promise<StudentWithRelations[]> {
  if (!query.trim()) return [];
  const supabase = createClient();
  const escaped = query.trim().replace(/[%_]/g, "\\$&");
  const pattern = "%" + escaped + "%";
  const { data } = await supabase
    .from("students")
    .select("*, sections(*, grades(*))")
    .eq("status", "active")
    .or("lrn.ilike." + pattern + ",first_name.ilike." + pattern + ",last_name.ilike." + pattern)
    .order("last_name")
    .limit(10);
  return (data || []).map(normalizeStudent);
}

/** Get a single student by ID with full relations */
export async function getStudentById(id: string): Promise<StudentWithRelations | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("*, sections(*, grades(*))")
    .eq("id", id)
    .maybeSingle();
  return data ? normalizeStudent(data) : null;
}

/** Check if an LRN is unique (optionally exclude a student ID for edits) */
export async function checkLRNUnique(lrn: string, excludeId?: string): Promise<boolean> {
  const supabase = createClient();
  let query = supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("lrn", lrn);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { count } = await query;
  return count === 0;
}

/** Create a new student record */
export async function createStudent(studentData: Omit<Student, "id" | "created_at">): Promise<Student | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .insert({
      section_id: studentData.section_id,
      lrn: studentData.lrn,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      middle_name: studentData.middle_name || null,
      birthday: studentData.birthday,
      birthplace: studentData.birthplace || null,
      address: studentData.address || null,
      father_name: studentData.father_name || null,
      mother_name: studentData.mother_name || null,
      guardian_name: studentData.guardian_name || null,
      contact_number: studentData.contact_number || null,
      remarks: studentData.remarks || null,
      status: studentData.status,
    })
    .select("*, sections(*, grades(*))")
    .single();
  if (error) throw error;
  return data ? normalizeStudent(data) : null;
}

/** Update an existing student record */
export async function updateStudent(id: string, studentData: Partial<Student>): Promise<Student | null> {
  const supabase = createClient();
  const payload: Record<string, unknown> = {};
  if (studentData.section_id !== undefined) payload.section_id = studentData.section_id;
  if (studentData.lrn !== undefined) payload.lrn = studentData.lrn;
  if (studentData.first_name !== undefined) payload.first_name = studentData.first_name;
  if (studentData.last_name !== undefined) payload.last_name = studentData.last_name;
  if (studentData.middle_name !== undefined) payload.middle_name = studentData.middle_name || null;
  if (studentData.birthday !== undefined) payload.birthday = studentData.birthday;
  if (studentData.birthplace !== undefined) payload.birthplace = studentData.birthplace || null;
  if (studentData.address !== undefined) payload.address = studentData.address || null;
  if (studentData.father_name !== undefined) payload.father_name = studentData.father_name || null;
  if (studentData.mother_name !== undefined) payload.mother_name = studentData.mother_name || null;
  if (studentData.guardian_name !== undefined) payload.guardian_name = studentData.guardian_name || null;
  if (studentData.contact_number !== undefined) payload.contact_number = studentData.contact_number || null;
  if (studentData.remarks !== undefined) payload.remarks = studentData.remarks || null;
  if (studentData.status !== undefined) payload.status = studentData.status;
  const { data, error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id)
    .select("*, sections(*, grades(*))")
    .single();
  if (error) throw error;
  return data ? normalizeStudent(data) : null;
}

// --- Helpers -----------------------------------------------------------------

function normalizeStudent(row: Record<string, unknown>): StudentWithRelations {
  const section = row.sections as Record<string, unknown> | null | undefined;
  const grade = section?.grades as Record<string, unknown> | null | undefined;
  return {
    id: row.id as string,
    section_id: row.section_id as string,
    lrn: row.lrn as string,
    first_name: row.first_name as string,
    last_name: row.last_name as string,
    middle_name: (row.middle_name as string | null) ?? undefined,
    birthday: row.birthday as string,
    birthplace: (row.birthplace as string | null) ?? undefined,
    address: (row.address as string | null) ?? undefined,
    father_name: (row.father_name as string | null) ?? undefined,
    mother_name: (row.mother_name as string | null) ?? undefined,
    guardian_name: (row.guardian_name as string | null) ?? undefined,
    contact_number: (row.contact_number as string | null) ?? undefined,
    remarks: (row.remarks as string | null) ?? undefined,
    status: row.status as Student["status"],
    created_at: row.created_at as string,
    section: section
      ? { id: section.id as string, grade_id: section.grade_id as string, name: section.name as string }
      : undefined,
    grade: grade
      ? { id: grade.id as string, school_year_id: grade.school_year_id as string, name: grade.name as string }
      : undefined,
  };
}

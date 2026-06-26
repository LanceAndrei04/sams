// Student documents data access layer — queries Supabase directly

import { createClient } from "@/lib/supabase/client";

export type DocumentDirection = "received" | "released";

export interface StudentDocument {
  id: string;
  student_id: string;
  document_name: string;
  document_date: string; // ISO date string
  direction: DocumentDirection;
  received_by?: string | null;
  released_by?: string | null;
  remarks?: string | null;
  created_at: string;
}

/** Get all documents for a given student, newest first */
export async function getDocumentsByStudent(
  studentId: string
): Promise<StudentDocument[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("student_documents")
    .select("*")
    .eq("student_id", studentId)
    .order("document_date", { ascending: false });

  return (data || []).map(normalizeDoc);
}

/** Create a new student document record */
export async function createDocument(
  data: Omit<StudentDocument, "id" | "created_at">
): Promise<StudentDocument> {
  const supabase = createClient();

  const { data: created, error } = await supabase
    .from("student_documents")
    .insert({
      student_id: data.student_id,
      document_name: data.document_name,
      document_date: data.document_date,
      direction: data.direction,
      received_by: data.received_by || null,
      released_by: data.released_by || null,
      remarks: data.remarks || null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return normalizeDoc(created);
}

/** Update an existing student document record */
export async function updateDocument(
  id: string,
  data: Partial<Omit<StudentDocument, "id" | "created_at">>
): Promise<StudentDocument | null> {
  const supabase = createClient();

  const { data: updated, error } = await supabase
    .from("student_documents")
    .update({
      ...(data.document_name !== undefined && {
        document_name: data.document_name,
      }),
      ...(data.document_date !== undefined && {
        document_date: data.document_date,
      }),
      ...(data.direction !== undefined && { direction: data.direction }),
      ...(data.received_by !== undefined && {
        received_by: data.received_by || null,
      }),
      ...(data.released_by !== undefined && {
        released_by: data.released_by || null,
      }),
      ...(data.remarks !== undefined && { remarks: data.remarks || null }),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeDoc(updated);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function normalizeDoc(row: Record<string, unknown>): StudentDocument {
  return {
    id: row.id as string,
    student_id: row.student_id as string,
    document_name: row.document_name as string,
    document_date: row.document_date as string,
    direction: row.direction as DocumentDirection,
    received_by: (row.received_by as string | null) ?? undefined,
    released_by: (row.released_by as string | null) ?? undefined,
    remarks: (row.remarks as string | null) ?? undefined,
    created_at: row.created_at as string,
  };
}

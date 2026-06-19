// Mock data for student documents
// In production this would use Supabase

export type DocumentDirection = "received" | "released";

export interface StudentDocument {
  id: string;
  student_id: string;
  document_name: string;
  document_date: string; // ISO date string
  direction: DocumentDirection;
  remarks?: string | null;
  created_at: string;
}

const mockDocuments: StudentDocument[] = [
  {
    id: "1",
    student_id: "1",
    document_name: "Report Card (SF9) - S.Y. 2024-2025",
    document_date: "2025-03-28",
    direction: "received",
    remarks: "First semester grades",
    created_at: "2025-03-28T08:00:00Z",
  },
  {
    id: "2",
    student_id: "1",
    document_name: "Good Moral Certificate",
    document_date: "2025-06-10",
    direction: "released",
    remarks: "For transfer requirements",
    created_at: "2025-06-10T09:30:00Z",
  },
  {
    id: "3",
    student_id: "1",
    document_name: "Form 137 (Permanent Record)",
    document_date: "2024-06-15",
    direction: "received",
    remarks: null,
    created_at: "2024-06-15T10:00:00Z",
  },
  {
    id: "4",
    student_id: "5",
    document_name: "Birth Certificate (PSA)",
    document_date: "2024-08-20",
    direction: "received",
    remarks: "Certified true copy",
    created_at: "2024-08-20T11:00:00Z",
  },
  {
    id: "5",
    student_id: "5",
    document_name: "Transfer Credentials",
    document_date: "2025-05-12",
    direction: "released",
    remarks: "Forwarded to Dasmarinas Elementary School",
    created_at: "2025-05-12T14:00:00Z",
  },
];

export async function getDocumentsByStudent(
  studentId: string
): Promise<StudentDocument[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockDocuments
    .filter((doc) => doc.student_id === studentId)
    .sort(
      (a, b) =>
        new Date(b.document_date).getTime() -
        new Date(a.document_date).getTime()
    );
}

export async function createDocument(
  data: Omit<StudentDocument, "id" | "created_at">
): Promise<StudentDocument> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const newDoc: StudentDocument = {
    id: String(mockDocuments.length + 1),
    ...data,
    created_at: new Date().toISOString(),
  };
  mockDocuments.push(newDoc);
  return newDoc;
}

export async function updateDocument(
  id: string,
  data: Partial<Omit<StudentDocument, "id" | "created_at">>
): Promise<StudentDocument | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const index = mockDocuments.findIndex((doc) => doc.id === id);
  if (index === -1) return null;
  mockDocuments[index] = { ...mockDocuments[index], ...data };
  return mockDocuments[index];
}

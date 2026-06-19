"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DocumentDialog from "@/components/students/document-dialog";
import {
  StudentDocument,
  DocumentDirection,
  getDocumentsByStudent,
  createDocument,
  updateDocument,
} from "@/lib/supabase/student-documents";
import { format } from "date-fns";

interface DocumentsTabProps {
  studentId: string;
}

const directionLabels: Record<DocumentDirection, string> = {
  received: "Received",
  released: "Released",
};

const directionVariants: Record<DocumentDirection, string> = {
  received:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  released:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

export default function DocumentsTab({ studentId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<StudentDocument | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await getDocumentsByStudent(studentId);
      setDocuments(docs);
    } catch {
      // Silently handle - empty state will show
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleAdd = () => {
    setEditingDocument(null);
    setDialogOpen(true);
  };

  const handleEdit = (doc: StudentDocument) => {
    setEditingDocument(doc);
    setDialogOpen(true);
  };

  const handleSave = async (data: {
    document_name: string;
    document_date: string;
    direction: DocumentDirection;
    remarks?: string | null;
  }) => {
    if (editingDocument) {
      await updateDocument(editingDocument.id, data);
    } else {
      await createDocument({
        student_id: studentId,
        ...data,
      });
    }
    await loadDocuments();
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-36 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Add button always visible */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {documents.length === 0
            ? "No documents recorded yet."
            : `${documents.length} document${documents.length === 1 ? "" : "s"} on file`}
        </p>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Document
        </Button>
      </div>

      {/* Empty state */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4 text-2xl">
              📄
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No documents recorded yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Track documents received from or released to this student, such as
              report cards, certificates, and clearance forms.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Documents table */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Document Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Received / Released</TableHead>
              <TableHead className="hidden md:table-cell">Remarks</TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  {doc.document_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(doc.document_date)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={directionVariants[doc.direction]}
                  >
                    {directionLabels[doc.direction]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                  {doc.remarks || "—"}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleEdit(doc)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/60 transition-colors"
                    aria-label={`Edit ${doc.document_name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Dialog */}
      <DocumentDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingDocument(null);
        }}
        onSave={handleSave}
        document={editingDocument}
      />
    </>
  );
}

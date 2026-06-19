"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StudentDocument,
  DocumentDirection,
} from "@/lib/supabase/student-documents";

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    document_name: string;
    document_date: string;
    direction: DocumentDirection;
    received_by?: string | null;
    released_by?: string | null;
    remarks?: string | null;
  }) => Promise<void>;
  document?: StudentDocument | null;
}

export default function DocumentDialog({
  isOpen,
  onClose,
  onSave,
  document,
}: DocumentDialogProps) {
  const [documentName, setDocumentName] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [direction, setDirection] = useState<DocumentDirection>("received");
  const [receivedBy, setReceivedBy] = useState("");
  const [releasedBy, setReleasedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{
    document_name?: string;
    document_date?: string;
  }>({});

  const isEditing = !!document;

  // Reset form when dialog opens/closes or document changes
  useEffect(() => {
    if (isOpen) {
      if (document) {
        setDocumentName(document.document_name);
        setDocumentDate(document.document_date);
        setDirection(document.direction);
        setReceivedBy(document.received_by ?? "");
        setReleasedBy(document.released_by ?? "");
        setRemarks(document.remarks ?? "");
      } else {
        setDocumentName("");
        setDocumentDate("");
        setDirection("received");
        setReceivedBy("");
        setReleasedBy("");
        setRemarks("");
      }
      setErrors({});
    }
  }, [isOpen, document]);

  const validate = (): boolean => {
    const newErrors: { document_name?: string; document_date?: string } = {};
    if (!documentName.trim()) {
      newErrors.document_name = "Document name is required";
    }
    if (!documentDate) {
      newErrors.document_date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        document_name: documentName.trim(),
        document_date: documentDate,
        direction,
        received_by: receivedBy.trim() || null,
        released_by: releasedBy.trim() || null,
        remarks: remarks.trim() || null,
      });
      onClose();
    } catch {
      // Parent will handle the error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Document" : "Add Document"}
      description="Record a document received from or released to a student."
      confirmLabel={saving ? "Saving..." : "Save"}
      cancelLabel="Cancel"
      onConfirm={saving ? undefined : handleSave}
    >
      <div className="space-y-4">
        {/* Document Name */}
        <div className="space-y-2">
          <Label htmlFor="doc-name">
            Document Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="doc-name"
            placeholder="e.g., Report Card (SF9), Good Moral, Form 137"
            value={documentName}
            onChange={(e) => {
              setDocumentName(e.target.value);
              if (errors.document_name) {
                setErrors((prev) => ({ ...prev, document_name: undefined }));
              }
            }}
          />
          {errors.document_name && (
            <p className="text-xs text-red-500 font-medium">
              {errors.document_name}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="doc-date">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="doc-date"
            type="date"
            value={documentDate}
            onChange={(e) => {
              setDocumentDate(e.target.value);
              if (errors.document_date) {
                setErrors((prev) => ({ ...prev, document_date: undefined }));
              }
            }}
          />
          {errors.document_date && (
            <p className="text-xs text-red-500 font-medium">
              {errors.document_date}
            </p>
          )}
        </div>

        {/* Direction */}
        <div className="space-y-2">
          <Label htmlFor="doc-direction">
            Direction <span className="text-red-500">*</span>
          </Label>
          <Select
            value={direction}
            onValueChange={(val) => setDirection(val as DocumentDirection)}
          >
            <SelectTrigger id="doc-direction">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="released">Released</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Received By */}
        <div className="space-y-2">
          <Label htmlFor="doc-received-by">Received By</Label>
          <Input
            id="doc-received-by"
            placeholder="Name of person who received"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
          />
        </div>

        {/* Released By */}
        <div className="space-y-2">
          <Label htmlFor="doc-released-by">Released By</Label>
          <Input
            id="doc-released-by"
            placeholder="Name of person who released"
            value={releasedBy}
            onChange={(e) => setReleasedBy(e.target.value)}
          />
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="doc-remarks">Remarks</Label>
          <Textarea
            id="doc-remarks"
            placeholder="Optional notes about this document"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </Dialog>
  );
}

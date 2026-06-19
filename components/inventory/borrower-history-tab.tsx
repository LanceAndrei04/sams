"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, CheckCircle } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BorrowRecord,
  InventoryItem,
  BorrowStatus,
  getItemsByCategory,
  getBorrowRecordsByCategory,
  createBorrowRecord,
  markBorrowReturned,
} from "@/lib/supabase/inventory";
import { format } from "date-fns";

type BorrowRecordRow = BorrowRecord & { item_name: string };

interface BorrowerHistoryTabProps {
  categoryId: string;
}

const statusVariants: Record<BorrowStatus, string> = {
  borrowed:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  returned:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
  overdue:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
};

const statusLabels: Record<BorrowStatus, string> = {
  borrowed: "Borrowed",
  returned: "Returned",
  overdue: "Overdue",
};

const formatDate = (d: string | null | undefined) => {
  if (!d) return "—";
  try {
    return format(new Date(d), "MMM d, yyyy");
  } catch {
    return d;
  }
};

export default function BorrowerHistoryTab({
  categoryId,
}: BorrowerHistoryTabProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [records, setRecords] = useState<BorrowRecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date_borrowed", desc: true },
  ]);

  // Log borrow dialog state
  const [logOpen, setLogOpen] = useState(false);
  const [logItemId, setLogItemId] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerGrade, setBorrowerGrade] = useState("");
  const [dateBorrowed, setDateBorrowed] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  const [logRemarks, setLogRemarks] = useState("");
  const [savingLog, setSavingLog] = useState(false);

  // Mark returned dialog state
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnRecord, setReturnRecord] = useState<BorrowRecordRow | null>(
    null
  );
  const [returnDate, setReturnDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  const [savingReturn, setSavingReturn] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [itms, recs] = await Promise.all([
        getItemsByCategory(categoryId),
        getBorrowRecordsByCategory(categoryId),
      ]);
      setItems(itms);
      setRecords(recs);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  // ── TanStack columns ──
  const columns = useMemo<ColumnDef<BorrowRecordRow>[]>(
    () => [
      {
        id: "item_name",
        accessorFn: (r) => r.item_name,
        header: "Item",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
      },
      {
        id: "borrower_name",
        accessorFn: (r) => r.borrower_name,
        header: "Borrower",
      },
      {
        id: "borrower_grade",
        accessorFn: (r) => r.borrower_grade || "—",
        header: "Grade",
        cell: (info) => (
          <span className="text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: "date_borrowed",
        accessorFn: (r) => r.date_borrowed,
        header: "Date Borrowed",
        cell: (info) => formatDate(info.getValue() as string),
      },
      {
        id: "date_returned",
        accessorFn: (r) => r.date_returned,
        header: "Date Returned",
        cell: (info) => (
          <span className="text-muted-foreground">
            {formatDate(info.getValue() as string | null)}
          </span>
        ),
      },
      {
        id: "status",
        accessorFn: (r) => r.status,
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as BorrowStatus;
          return (
            <Badge className={statusVariants[status]}>
              {statusLabels[status]}
            </Badge>
          );
        },
      },
      {
        id: "remarks",
        accessorFn: (r) => r.remarks || "—",
        header: "Remarks",
        cell: (info) => (
          <span className="text-muted-foreground hidden md:table-cell max-w-[160px] truncate">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: (info) => {
          const rec = info.row.original;
          return rec.status === "borrowed" ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openReturn(rec);
              }}
              className="p-1.5 rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
              aria-label={`Mark ${rec.item_name} as returned`}
              title="Mark Returned"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          ) : null;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: records,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ── Action handlers ──

  const openLog = () => {
    setLogItemId(items.length === 1 ? items[0].id : "");
    setBorrowerName("");
    setBorrowerGrade("");
    setDateBorrowed(format(new Date(), "yyyy-MM-dd"));
    setLogRemarks("");
    setLogOpen(true);
  };

  const handleLogBorrow = async () => {
    if (!logItemId || !borrowerName.trim() || !dateBorrowed) return;
    setSavingLog(true);
    try {
      await createBorrowRecord({
        item_id: logItemId,
        borrower_name: borrowerName.trim(),
        borrower_grade: borrowerGrade.trim() || null,
        date_borrowed: dateBorrowed,
        date_returned: null,
        status: "borrowed",
        remarks: logRemarks.trim() || null,
      });
      setLogOpen(false);
      await load();
    } finally {
      setSavingLog(false);
    }
  };

  const openReturn = (rec: BorrowRecordRow) => {
    setReturnRecord(rec);
    setReturnDate(format(new Date(), "yyyy-MM-dd"));
    setReturnOpen(true);
  };

  const handleMarkReturned = async () => {
    if (!returnRecord || !returnDate) return;
    setSavingReturn(true);
    try {
      await markBorrowReturned(returnRecord.id, returnDate);
      setReturnOpen(false);
      await load();
    } finally {
      setSavingReturn(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {records.length === 0
            ? "No borrow records yet."
            : `${records.length} record${records.length === 1 ? "" : "s"}`}
        </p>
        <Button size="sm" onClick={openLog} disabled={items.length === 0}>
          <Plus className="w-4 h-4 mr-1.5" />
          Log Borrow
        </Button>
      </div>

      {/* Empty */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4 text-2xl">
              📋
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No borrow records yet.
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {items.length === 0
                ? "Add items to this category first before logging borrows."
                : "Log the first borrow to start tracking."}
            </p>
            {items.length > 0 && (
              <Button size="sm" onClick={openLog}>
                <Plus className="w-4 h-4 mr-1.5" />
                Log Borrow
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* TanStack DataTable */
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none hover:text-foreground transition-colors"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Log Borrow Dialog */}
      <Dialog
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
        title="Log Borrow"
        description="Record an item being borrowed."
        confirmLabel={savingLog ? "Saving..." : "Save"}
        cancelLabel="Cancel"
        onConfirm={savingLog ? undefined : handleLogBorrow}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="borrow-item">
              Item <span className="text-red-500">*</span>
            </Label>
            <Select value={logItemId} onValueChange={setLogItemId}>
              <SelectTrigger id="borrow-item">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((it) => (
                  <SelectItem key={it.id} value={it.id}>
                    {it.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrower-name">
              Borrower Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="borrower-name"
              placeholder="Full name"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrower-grade">Borrower Grade / Dept</Label>
            <Input
              id="borrower-grade"
              placeholder="e.g., Grade 5, Teacher, Office"
              value={borrowerGrade}
              onChange={(e) => setBorrowerGrade(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-date">
              Date Borrowed <span className="text-red-500">*</span>
            </Label>
            <Input
              id="borrow-date"
              type="date"
              value={dateBorrowed}
              onChange={(e) => setDateBorrowed(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-remarks">Remarks</Label>
            <Textarea
              id="borrow-remarks"
              placeholder="Optional notes"
              value={logRemarks}
              onChange={(e) => setLogRemarks(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </Dialog>

      {/* Mark Returned Dialog */}
      <Dialog
        isOpen={returnOpen}
        onClose={() => setReturnOpen(false)}
        title="Mark as Returned"
        description={
          returnRecord
            ? `Confirm return of "${returnRecord.item_name}" borrowed by ${returnRecord.borrower_name}.`
            : ""
        }
        confirmLabel={savingReturn ? "Saving..." : "Confirm Return"}
        cancelLabel="Cancel"
        onConfirm={savingReturn ? undefined : handleMarkReturned}
      >
        <div className="space-y-3">
          <Label htmlFor="return-date">
            Date Returned <span className="text-red-500">*</span>
          </Label>
          <Input
            id="return-date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      </Dialog>
    </>
  );
}

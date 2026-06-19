// Mock data for inventory management
// In production this would use Supabase

// ─── Types ────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
}

export interface InventoryItem {
  id: string;
  category_id: string;
  name: string;
  quantity: number;
  created_at: string;
}

export type BorrowStatus = "borrowed" | "returned" | "overdue";

export interface BorrowRecord {
  id: string;
  item_id: string;
  borrower_name: string;
  borrower_grade?: string | null;
  date_borrowed: string; // ISO date
  date_returned?: string | null; // nullable -- null means still out
  status: BorrowStatus;
  remarks?: string | null;
  created_at: string;
}

// ─── Mock Data ────────────────────────────────────

const mockCategories: Category[] = [
  { id: "1", name: "Science Materials" },
  { id: "2", name: "Math Equipment" },
  { id: "3", name: "PE Equipment" },
  { id: "4", name: "Art Supplies" },
  { id: "5", name: "Library Books" },
];

const mockItems: InventoryItem[] = [
  { id: "1", category_id: "1", name: "Microscope Set", quantity: 5, created_at: "2024-06-01T00:00:00Z" },
  { id: "2", category_id: "1", name: "Beaker Set", quantity: 20, created_at: "2024-06-01T00:00:00Z" },
  { id: "3", category_id: "1", name: "Magnifying Glass", quantity: 15, created_at: "2024-06-01T00:00:00Z" },
  { id: "4", category_id: "2", name: "Ruler Set", quantity: 30, created_at: "2024-06-01T00:00:00Z" },
  { id: "5", category_id: "2", name: "Compass", quantity: 25, created_at: "2024-06-01T00:00:00Z" },
  { id: "6", category_id: "2", name: "Calculator", quantity: 10, created_at: "2024-06-01T00:00:00Z" },
  { id: "7", category_id: "3", name: "Basketball", quantity: 8, created_at: "2024-06-01T00:00:00Z" },
  { id: "8", category_id: "3", name: "Volleyball", quantity: 6, created_at: "2024-06-01T00:00:00Z" },
  { id: "9", category_id: "4", name: "Crayon Set", quantity: 40, created_at: "2024-06-01T00:00:00Z" },
  { id: "10", category_id: "4", name: "Watercolor Paint", quantity: 20, created_at: "2024-06-01T00:00:00Z" },
];

const mockBorrowRecords: BorrowRecord[] = [
  { id: "1", item_id: "1", borrower_name: "Maria Santos", borrower_grade: "Grade 5", date_borrowed: "2025-01-15", date_returned: "2025-01-20", status: "returned", remarks: "Used for science fair", created_at: "2025-01-15T08:00:00Z" },
  { id: "2", item_id: "7", borrower_name: "Juan Cruz", borrower_grade: "Grade 6", date_borrowed: "2025-02-10", date_returned: null, status: "borrowed", remarks: "For P.E. class", created_at: "2025-02-10T09:00:00Z" },
  { id: "3", item_id: "9", borrower_name: "Ana Reyes", borrower_grade: "Grade 3", date_borrowed: "2025-01-25", date_returned: "2025-02-05", status: "returned", remarks: null, created_at: "2025-01-25T10:00:00Z" },
  { id: "4", item_id: "5", borrower_name: "Pedro Bautista", borrower_grade: "Teacher", date_borrowed: "2024-12-01", date_returned: null, status: "overdue", remarks: "Math department asset", created_at: "2024-12-01T11:00:00Z" },
  { id: "5", item_id: "2", borrower_name: "Sofia Garcia", borrower_grade: "Grade 4", date_borrowed: "2025-03-01", date_returned: null, status: "borrowed", remarks: "Science experiment", created_at: "2025-03-01T08:30:00Z" },
];

// ─── Categories ────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [...mockCategories];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await new Promise((r) => setTimeout(r, 80));
  return mockCategories.find((c) => c.id === id) ?? null;
}

export async function createCategory(name: string): Promise<Category> {
  await new Promise((r) => setTimeout(r, 200));
  const newCat: Category = { id: String(mockCategories.length + 1), name };
  mockCategories.push(newCat);
  return newCat;
}

/** Count of items scoped to a category */
export async function getItemCountByCategory(categoryId: string): Promise<number> {
  return mockItems.filter((i) => i.category_id === categoryId).length;
}

export async function getItemCountsByCategory(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  mockCategories.forEach((cat) => {
    counts[cat.id] = mockItems.filter((i) => i.category_id === cat.id).length;
  });
  return counts;
}

// ─── Items ────────────────────────────────────────

export async function getItemsByCategory(categoryId: string): Promise<InventoryItem[]> {
  await new Promise((r) => setTimeout(r, 100));
  return mockItems.filter((i) => i.category_id === categoryId);
}

export async function createItem(data: Omit<InventoryItem, "id" | "created_at">): Promise<InventoryItem> {
  await new Promise((r) => setTimeout(r, 200));
  const newItem: InventoryItem = {
    id: String(mockItems.length + 1),
    ...data,
    created_at: new Date().toISOString(),
  };
  mockItems.push(newItem);
  return newItem;
}

export async function updateItem(id: string, data: Partial<Pick<InventoryItem, "name" | "quantity">>): Promise<InventoryItem | null> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = mockItems.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  mockItems[idx] = { ...mockItems[idx], ...data };
  return mockItems[idx];
}

// ─── Borrow Records ───────────────────────────────

export async function getBorrowRecordsByCategory(categoryId: string): Promise<(BorrowRecord & { item_name: string })[]> {
  await new Promise((r) => setTimeout(r, 120));
  const itemIds = mockItems.filter((i) => i.category_id === categoryId).map((i) => i.id);
  return mockBorrowRecords
    .filter((r) => itemIds.includes(r.item_id))
    .map((r) => ({
      ...r,
      item_name: mockItems.find((i) => i.id === r.item_id)?.name ?? "Unknown",
    }))
    .sort((a, b) => new Date(b.date_borrowed).getTime() - new Date(a.date_borrowed).getTime());
}

export async function createBorrowRecord(data: Omit<BorrowRecord, "id" | "created_at">): Promise<BorrowRecord> {
  await new Promise((r) => setTimeout(r, 200));
  const newRec: BorrowRecord = {
    id: String(mockBorrowRecords.length + 1),
    ...data,
    created_at: new Date().toISOString(),
  };
  mockBorrowRecords.push(newRec);
  return newRec;
}

export async function markBorrowReturned(recordId: string, dateReturned: string): Promise<BorrowRecord | null> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = mockBorrowRecords.findIndex((r) => r.id === recordId);
  if (idx === -1) return null;
  mockBorrowRecords[idx] = {
    ...mockBorrowRecords[idx],
    date_returned: dateReturned,
    status: "returned",
  };
  return mockBorrowRecords[idx];
}

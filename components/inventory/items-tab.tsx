"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InventoryItem,
  getItemsByCategory,
  createItem,
  updateItem,
} from "@/lib/supabase/inventory";

interface ItemsTabProps {
  categoryId: string;
}

export default function ItemsTab({ categoryId }: ItemsTabProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItemsByCategory(categoryId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingItem(null);
    setItemName("");
    setQuantity("");
    setDialogOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setQuantity(String(item.quantity));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!itemName.trim() || !quantity) return;
    setSaving(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, {
          name: itemName.trim(),
          quantity: Number(quantity),
        });
      } else {
        await createItem({
          category_id: categoryId,
          name: itemName.trim(),
          quantity: Number(quantity),
        });
      }
      setDialogOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {items.length === 0
            ? "No items in this category yet."
            : `${items.length} item${items.length === 1 ? "" : "s"}`}
        </p>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Item
        </Button>
      </div>

      {/* Empty */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4 text-2xl">
              📦
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No items in this category yet.
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first item to start tracking inventory.
            </p>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Table */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="w-28">Quantity</TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/60 transition-colors"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? "Edit Item" : "Add Item"}
        description={
          editingItem
            ? "Update the item name and quantity."
            : "Add a new item to this category."
        }
        confirmLabel={saving ? "Saving..." : "Save"}
        cancelLabel="Cancel"
        onConfirm={saving ? undefined : handleSave}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="item-name"
              placeholder="e.g., Microscope Set"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-qty">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="item-qty"
              type="number"
              min={0}
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

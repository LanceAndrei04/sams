"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  getCategories,
  getItemCountsByCategory,
  createCategory,
  Category,
} from "@/lib/supabase/inventory";

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, ct] = await Promise.all([
        getCategories(),
        getItemCountsByCategory(),
      ]);
      setCategories(cats);
      setCounts(ct);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddCategory = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await createCategory(newName.trim());
      setNewName("");
      setDialogOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  // Colour palette for cards (rotating)
  const colours = [
    "from-blue-400 to-blue-500",
    "from-green-400 to-green-500",
    "from-red-400 to-red-500",
    "from-purple-400 to-purple-500",
    "from-amber-400 to-amber-500",
    "from-indigo-400 to-indigo-500",
    "from-pink-400 to-pink-500",
    "from-teal-400 to-teal-500",
  ];

  // ── Loading state ──
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">School assets and materials management</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 border border-border rounded-lg bg-card animate-pulse">
              <div className="h-5 w-24 bg-muted rounded mb-4" />
              <div className="h-10 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">
              {categories.length} categor{categories.length === 1 ? "y" : "ies"}
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No categories yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Create your first inventory category to start tracking school assets.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Card>
      ) : (
        /* Card grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/inventory/${cat.id}`} className="block">
              <div
                className={`p-6 rounded-[16px] bg-gradient-to-br ${colours[i % colours.length]} text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)] hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{cat.name}</h3>
                  <div className="text-3xl font-bold">{counts[cat.id] ?? 0}</div>
                </div>
                <div className="text-sm opacity-90">
                  {counts[cat.id] === 1 ? "1 item" : `${counts[cat.id] ?? 0} items`}
                </div>
                <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/40 rounded-full"
                    style={{
                      width: `${Math.min(((counts[cat.id] ?? 0) / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}

          {/* + Add Category card */}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="p-6 rounded-[16px] border-2 border-dashed border-white/50 bg-white/10 hover:bg-white/20 transition-colors text-center flex flex-col items-center justify-center min-h-[140px] cursor-pointer"
          >
            <Plus className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-muted-foreground">
              Add Category
            </span>
          </button>
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setNewName("");
        }}
        title="Add Category"
        description="Create a new inventory category."
        confirmLabel={saving ? "Saving..." : "Save"}
        cancelLabel="Cancel"
        onConfirm={saving ? undefined : handleAddCategory}
      >
        <div className="space-y-3">
          <Label htmlFor="cat-name">
            Category Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cat-name"
            placeholder="e.g., Science Materials"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !saving) handleAddCategory();
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}

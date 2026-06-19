"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCategoryById, Category } from "@/lib/supabase/inventory";
import ItemsTab from "@/components/inventory/items-tab";
import BorrowerHistoryTab from "@/components/inventory/borrower-history-tab";

const storageKey = (categoryId: string) =>
  `sams:inventory-tab:${categoryId}`;

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("items");

  // Restore persisted tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(storageKey(categoryId));
      if (saved === "items" || saved === "borrowers") setTab(saved);
    }
  }, [categoryId]);

  const handleTabChange = (next: string) => {
    setTab(next);
    sessionStorage.setItem(storageKey(categoryId), next);
  };

  const loadCategory = useCallback(async () => {
    setLoading(true);
    try {
      const cat = await getCategoryById(categoryId);
      setCategory(cat);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        <div className="h-8 w-60 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  // Not found
  if (!category) {
    return (
      <div className="space-y-6">
        <Link
          href="/inventory"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
        </Link>
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Category not found
          </h2>
          <Button asChild>
            <Link href="/inventory">Back to Inventory</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/inventory"
        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Inventory
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
          <p className="text-muted-foreground">Manage items and track borrowers</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="borrowers">Borrower History</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <ItemsTab categoryId={categoryId} />
        </TabsContent>

        <TabsContent value="borrowers">
          <BorrowerHistoryTab categoryId={categoryId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

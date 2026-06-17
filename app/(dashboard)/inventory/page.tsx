// Inventory page - placeholder for testing navigation
// This is a blank page as requested for UI testing

import { Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Inventory</h2>
            <p className="text-muted-foreground">
              School assets and materials management
            </p>
          </div>
        </div>
      </div>
      
      {/* Placeholder content for testing UI */}
      <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-foreground mb-2">Inventory Management</h3>
        <p className="text-muted-foreground">
          This is a placeholder page for testing the inventory navigation.
          <br />
          No functional content has been added as requested.
        </p>
      </div>
      
      {/* Placeholder category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Science Materials", color: "bg-blue-500", count: 45 },
          { name: "Math Equipment", color: "bg-green-500", count: 23 },
          { name: "PE Equipment", color: "bg-red-500", count: 12 },
          { name: "Art Supplies", color: "bg-purple-500", count: 34 },
          { name: "Library Books", color: "bg-amber-500", count: 189 },
          { name: "IT Equipment", color: "bg-indigo-500", count: 56 },
        ].map((category, index) => (
          <div
            key={index}
            className="p-6 border border-border rounded-lg bg-card hover:bg-card/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {category.count}
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {category.name}
            </h3>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${category.color} rounded-full`}
                style={{ width: `${Math.min(category.count / 2, 100)}%` }}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Click to view items
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
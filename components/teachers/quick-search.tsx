"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuickSearchProps {
  value: string;
  onChangeAction: (value: string) => void;
}

export default function QuickSearch({ value, onChangeAction }: QuickSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by name or employee number..."
        className="pl-10 w-full"
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
      />
    </div>
  );
}

"use client";

import { Grid3X3, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TeachersView = "cards" | "table";
export const teachersViewPreferenceKey = "teachers-view-preference";

export default function ViewToggle({
  value,
  onValueChange,
}: {
  value: TeachersView;
  onValueChange: (value: TeachersView) => void;
}) {
  return (
    <Tabs value={value} onValueChange={(nextValue) => onValueChange(nextValue as TeachersView)}>
      <TabsList>
        <TabsTrigger value="cards">
          <Grid3X3 data-icon="inline-start" />
          Cards
        </TabsTrigger>
        <TabsTrigger value="table">
          <List data-icon="inline-start" />
          Table
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

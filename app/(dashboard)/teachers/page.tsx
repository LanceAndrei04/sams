"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherCardGrid from "@/components/teachers/teacher-card-grid";
import QuickSearch from "@/components/teachers/quick-search";
import { getTeachers, searchTeachers, Teacher } from "@/lib/supabase/teachers";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch teachers on mount
  useEffect(() => {
    async function fetchTeachers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeachers();
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (err) {
        setError("Couldn't load teachers. Please try again.");
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  // Filter teachers when search query changes
  useEffect(() => {
    const filtered = searchTeachers(teachers, debouncedSearchQuery);
    setFilteredTeachers(filtered);
  }, [debouncedSearchQuery, teachers]);

  // Render skeleton cards for loading state
  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-4 p-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );

  // Render empty state
  const EmptyState = ({ isSearchResult }: { isSearchResult: boolean }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg text-muted-foreground mb-4">
        {isSearchResult
          ? "No teachers match your search."
          : "No teachers added yet."}
      </p>
      {!isSearchResult && (
        <Link href="/teachers/add">
          <Button size="lg">+ Add Teacher</Button>
        </Link>
      )}
    </div>
  );

  // Render error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg text-muted-foreground mb-4">
        Couldn't load teachers. Please try again.
      </p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Teachers</h1>
      </div>

      {/* Search and Add Button Row */}
      <div className="flex items-center gap-4">
        <QuickSearch
          value={searchQuery}
          onChangeAction={setSearchQuery}
        />
        <Link href="/teachers/add">
          <Button>+ Add Teacher</Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState />
      ) : filteredTeachers.length === 0 ? (
        <EmptyState isSearchResult={searchQuery.length > 0} />
      ) : (
        <TeacherCardGrid teachers={filteredTeachers} />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchStudents } from "@/lib/supabase/students";
import { StudentWithRelations } from "@/lib/supabase/students";
import { cn } from "@/lib/utils";

export default function QuickSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentWithRelations[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsSearching(true);
      const searchResults = await searchStudents(debouncedQuery);
      setResults(searchResults);
      setIsSearching(false);
      setIsOpen(searchResults.length > 0);
    }

    performSearch();
  }, [debouncedQuery]);

  const handleResultClick = (student: StudentWithRelations) => {
    router.push(`/students/${student.id}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by LRN or Name..."
          className="pl-10 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // Delay closing to allow clicks on results
            setTimeout(() => setIsOpen(false), 200);
          }}
        />
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No students found
            </div>
          ) : (
            <div className="py-1">
              {results.map((student) => (
                <button
                  key={student.id}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-muted transition-colors",
                    "focus:outline-none focus:bg-muted"
                  )}
                  onClick={() => handleResultClick(student)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                >
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {student.last_name}, {student.first_name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                        {student.lrn}
                      </code>
                      <span>•</span>
                      <span>{student.grade?.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
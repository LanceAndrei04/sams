"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none items-center justify-between rounded-[20px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(226,231,233,0.82))] px-3 py-2 text-sm text-foreground shadow-[inset_2px_2px_6px_rgba(163,173,175,0.16),inset_-2px_-2px_6px_rgba(255,255,255,0.94)] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

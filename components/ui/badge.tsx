import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "active" | "inactive" | "transferred" | "default" | "own_station" | "reassigned" | "borrowed" | "clustered";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-colors",
        {
          "bg-[linear-gradient(145deg,rgba(223,242,235,0.98),rgba(205,227,217,0.9))] text-emerald-800 border-emerald-200":
            variant === "active",
          "bg-[linear-gradient(145deg,rgba(223,242,235,0.98),rgba(205,227,217,0.9))] text-emerald-800 border-emerald-200":
            variant === "own_station",
          "bg-[linear-gradient(145deg,rgba(232,235,239,0.98),rgba(216,222,229,0.9))] text-slate-800 border-slate-200":
            variant === "inactive",
          "bg-[linear-gradient(145deg,rgba(221,232,246,0.98),rgba(202,216,235,0.9))] text-blue-800 border-blue-200":
            variant === "reassigned",
          "bg-[linear-gradient(145deg,rgba(255,241,217,0.98),rgba(241,216,174,0.92))] text-amber-800 border-amber-200":
            variant === "transferred",
          "bg-[linear-gradient(145deg,rgba(255,241,217,0.98),rgba(241,216,174,0.92))] text-amber-800 border-amber-200":
            variant === "borrowed",
          "bg-[linear-gradient(145deg,rgba(233,226,245,0.98),rgba(219,208,235,0.92))] text-violet-800 border-violet-200":
            variant === "clustered",
          "bg-[linear-gradient(145deg,rgba(238,242,243,0.98),rgba(223,228,229,0.92))] text-primary border-white/80":
            variant === "default",
        },
        className
      )}
      {...props}
    />
  );
}

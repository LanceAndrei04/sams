"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/lib/navigation";
import { Menu, X, School } from "lucide-react";

export default function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(223,228,229,0.82))] shadow-[12px_0_28px_rgba(163,173,175,0.22)] transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/60">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(220,228,229,0.85))] p-2 shadow-[6px_6px_14px_rgba(163,173,175,0.28),-6px_-6px_14px_rgba(255,255,255,0.9)]">
            <School className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">SAMS Admin</span>
              <span className="text-xs text-muted-foreground">School Admin System</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(226,231,232,0.78))] p-2 shadow-[6px_6px_14px_rgba(163,173,175,0.22),-6px_-6px_14px_rgba(255,255,255,0.9)] transition-all hover:brightness-[0.98]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-muted-foreground" />
          ) : (
            <X className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
            const Icon = item.icon;
            
            return (
          <Link
                key={item.route}
                href={item.route}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200",
                  isActive
                    ? "bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(225,231,232,0.88))] text-primary shadow-[inset_3px_3px_8px_rgba(163,173,175,0.16),inset_-3px_-3px_8px_rgba(255,255,255,0.92)]"
                    : "text-muted-foreground hover:bg-white/55 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {!isCollapsed && isActive && (
                  <span className="ml-auto w-2 h-2 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className={cn("border-t border-white/60 p-4", isCollapsed && "text-center")}>
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Version 0.1</span>
              <span className="rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(224,230,231,0.82))] px-2 py-1 text-xs text-primary shadow-[inset_2px_2px_5px_rgba(163,173,175,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
                MVP
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Need help?{" "}
              <a href="#" className="text-primary hover:underline">
                Contact support
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium">v0.1</span>
            <span className="w-6 h-2 bg-primary/20 rounded-full" />
          </div>
        )}
      </div>
    </aside>
  );
}

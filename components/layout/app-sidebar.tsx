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
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="p-2 bg-primary/10 rounded-lg">
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
          className="p-2 hover:bg-muted rounded-lg transition-colors"
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
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
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
      <div className={cn("p-4 border-t border-border", isCollapsed && "text-center")}>
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Version 0.1</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
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
"use client";

import { usePathname } from "next/navigation";
import { mainNavItems, currentSchoolYear, headerNavItems } from "@/lib/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { Bell, HelpCircle, UserCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
  const pathname = usePathname();
  
  // Find current page title
  const currentPage = mainNavItems.find(item => 
    pathname === item.route || pathname.startsWith(`${item.route}/`)
  );
  
  const pageTitle = currentPage?.label || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-6 py-4">
      {/* Left side: Page title and breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {currentPage?.description || "Overview and system management"}
          </p>
        </div>
        
        {/* School Year Badge */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          currentSchoolYear.status === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            currentSchoolYear.status === "active" 
              ? "bg-green-500" 
              : "bg-amber-500"
          )} />
          <span>{currentSchoolYear.label}</span>
          <span className="text-xs opacity-75">
            {currentSchoolYear.status === "active" ? "Active" : "Archived"}
          </span>
        </div>
      </div>

      {/* Right side: Actions and user menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors relative"
          aria-label={headerNavItems.notifications.label}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
        </button>
        
        {/* Help */}
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label={headerNavItems.help.label}
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* User Profile + Theme Toggle */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <button
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Open user menu"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          
          {/* Theme Toggle */}
          <div className="ml-2 pl-2 border-l border-border">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
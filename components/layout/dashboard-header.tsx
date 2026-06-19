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
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(226,231,233,0.84))] px-6 py-4 shadow-[0_12px_28px_rgba(163,173,175,0.14)] backdrop-blur-sm">
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
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow-[inset_2px_2px_6px_rgba(163,173,175,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.95)]",
          currentSchoolYear.status === "active"
            ? "bg-[linear-gradient(145deg,rgba(223,242,235,0.96),rgba(205,227,217,0.88))] text-green-800"
            : "bg-[linear-gradient(145deg,rgba(255,244,221,0.96),rgba(244,225,185,0.88))] text-amber-800"
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
          className="relative rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.85),rgba(226,231,233,0.8))] p-2 shadow-[6px_6px_14px_rgba(163,173,175,0.18),-6px_-6px_14px_rgba(255,255,255,0.9)] transition-all hover:brightness-[0.98]"
          aria-label={headerNavItems.notifications.label}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
        </button>
        
        {/* Help */}
        <button
          className="rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.85),rgba(226,231,233,0.8))] p-2 shadow-[6px_6px_14px_rgba(163,173,175,0.18),-6px_-6px_14px_rgba(255,255,255,0.9)] transition-all hover:brightness-[0.98]"
          aria-label={headerNavItems.help.label}
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* User Profile + Theme Toggle */}
        <div className="flex items-center gap-3 border-l border-white/70 pl-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(223,228,229,0.86))] shadow-[inset_2px_2px_5px_rgba(163,173,175,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.96)]">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <button
            className="rounded-lg bg-[linear-gradient(145deg,rgba(255,255,255,0.85),rgba(226,231,233,0.8))] p-1 shadow-[4px_4px_10px_rgba(163,173,175,0.16),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all hover:brightness-[0.98]"
            aria-label="Open user menu"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          
          {/* Theme Toggle */}
          <div className="ml-2 border-l border-white/70 pl-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ChevronDown, UserCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) setUser(user);
    });
    return () => { ignore = true; };
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User";
  const email = user?.email || "";

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } finally {
      setOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-[linear-gradient(145deg,rgba(255,255,255,0.85),rgba(226,231,233,0.8))] p-1.5 pl-1 shadow-[6px_6px_14px_rgba(163,173,175,0.18),-6px_-6px_14px_rgba(255,255,255,0.9)] transition-all hover:brightness-[0.98]"
        aria-label="Open user menu"
      >
        {/* Avatar */}
        <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(223,228,229,0.86))] shadow-[inset_2px_2px_5px_rgba(163,173,175,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.96)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="size-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <UserCircle className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(226,231,233,0.92))] p-3 shadow-[12px_12px_32px_rgba(163,173,175,0.28),-6px_-6px_16px_rgba(255,255,255,0.9)] backdrop-blur-sm z-50">
          {/* User Info */}
          <div className="flex items-center gap-4 px-2 py-3">
            {/* Avatar */}
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(223,228,229,0.86))] shadow-[inset_3px_3px_8px_rgba(163,173,175,0.18),inset_-3px_-3px_8px_rgba(255,255,255,0.96)]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="size-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCircle className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-white/60" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50/80 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loading ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

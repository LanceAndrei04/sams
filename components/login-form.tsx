"use client";

import { useState } from "react";
import { Loader2, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // If no error, the browser is redirecting to Google — no need to reset loading
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between w-full lg:w-1/2 min-h-screen p-8 sm:p-12 md:p-20 bg-background text-foreground transition-colors duration-300">
      {/* Top spacer */}
      <div className="flex items-center justify-between w-full">
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
            <span className="font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">SAMS Admin Portal</span>
        </div>
        <div className="hidden lg:block" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Sign In</h1>
          <p className="text-muted-foreground text-sm">
            Sign in with your Google account to manage records, sections, and inventory.
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="relative flex items-center justify-center w-full h-12 rounded-xl border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(224,230,231,0.8))] text-foreground font-semibold text-sm shadow-[6px_6px_14px_rgba(163,173,175,0.38),-6px_-6px_14px_rgba(255,255,255,0.8)] hover:shadow-[4px_4px_10px_rgba(163,173,175,0.34),-4px_-4px_10px_rgba(255,255,255,0.86)] active:scale-[0.99] cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Redirecting to Google...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">
              School Administration System
            </span>
          </div>
        </div>

        {/* Info note */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Only authorized school personnel with a valid Google account can access this system.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-border/50 pt-6 mt-auto">
        <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
          <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Need Technical Assistance?</p>
            <p>
              Contact the Registrar Helpdesk at{" "}
              <a href="mailto:support@sams.edu.ph" className="text-primary font-medium hover:underline">
                support@sams.edu.ph
              </a>{" "}
              or dial local extension <strong>#423</strong> (available 8:00 AM - 5:00 PM PHT).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

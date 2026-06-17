"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, KeyRound, UserCheck, HelpCircle } from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("encoder");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validate = () => {
    const activeErrors: { email?: string; password?: string } = {};
    if (!email) {
      activeErrors.email = "Username or Email is required";
    } else if (email.includes("@") && !/\S+@\S+\.\S+/.test(email)) {
      activeErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      activeErrors.password = "Password is required";
    } else if (password.length < 4) {
      activeErrors.password = "Password must be at least 4 characters";
    }
    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API authorization request
    setTimeout(() => {
      setLoading(false);
      setLoginSuccess(true);
    }, 1500);
  };

  return (
    <div className="relative flex flex-col justify-between w-full lg:w-1/2 min-h-screen p-8 sm:p-12 md:p-20 bg-background text-foreground transition-colors duration-300">

      {/* Top Controls: Logo and Theme Toggle */}
      <div className="flex items-center justify-between w-full">
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
            <span className="font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">SAMS Admin Portal</span>
        </div>
        <div className="hidden lg:block" /> {/* Spacer */}
        <ThemeToggle />
      </div>

      {/* Main Login Form Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Sign In</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to manage records, sections, and inventory.
          </p>
        </div>

        {loginSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Access Granted</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome back! Redirecting you to the <strong>{role}</strong> dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Email / Username Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Username or Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </span>
                <input
                  id="email"
                  type="text"
                  placeholder="name@school.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-foreground text-sm transition-all ${errors.email ? "border-rose-500 ring-4 ring-rose-500/10" : "border-border"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Security Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-card text-foreground text-sm transition-all ${errors.password ? "border-rose-500 ring-4 ring-rose-500/10" : "border-border"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary bg-card focus:ring-4 focus:ring-primary/20 accent-primary"
              />
              <label htmlFor="remember" className="ml-2.5 text-xs text-muted-foreground font-medium select-none cursor-pointer">
                Keep session logged in (session persist)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative flex items-center justify-center w-full h-11 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold text-sm shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] cursor-pointer transition-all duration-150"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Authenticate & Sign In
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer Support Information */}
      <div className="w-full border-t border-border/50 pt-6 mt-auto">
        <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Need Technical Assistance?</p>
            <p>
              Contact the Registrar Helpdesk at <a href="mailto:support@sams.edu.ph" className="text-primary font-medium hover:underline">support@sams.edu.ph</a> or dial local extension <strong>#423</strong> (available 8:00 AM - 5:00 PM PHT).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

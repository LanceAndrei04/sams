import Image from "next/image";
import { School, Activity, ShieldCheck, Database } from "lucide-react";

export default function LoginVisual() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen p-12 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white overflow-hidden border-r border-blue-950">
      {/* Decorative background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 backdrop-blur-md">
          <School className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <span className="font-semibold tracking-wider uppercase text-xs text-blue-400">Administration Portal</span>
          <h2 className="text-sm font-bold text-slate-200">SAMS</h2>
        </div>
      </div>

      {/* Center Image Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto max-w-xl mx-auto">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40 shadow-2xl backdrop-blur-sm group transition-transform duration-500 hover:scale-[1.01]">
          <Image
            src="/login-bg.png"
            alt="School Admin Management System Dashboard Preview"
            fill
            className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            priority
            sizes="(max-width: 1024px) 0vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
            Simplify School Operations
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
            Consolidating classroom scheduling, student enrollments, and inventory management into a unified, secure database built for efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}

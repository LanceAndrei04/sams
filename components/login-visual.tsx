import Image from "next/image";
import { School, Activity, ShieldCheck, Database } from "lucide-react";

export default function LoginVisual() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen p-12 bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white overflow-hidden border-r border-emerald-950">
      {/* Decorative background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-400/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-teal-400/10 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 backdrop-blur-md">
          <School className="w-5 h-5 text-emerald-300" />
        </div>
        <div>
          <span className="font-semibold tracking-wider uppercase text-xs text-emerald-300">Administration Portal</span>
          <h2 className="text-sm font-bold text-white">SAMS</h2>
        </div>
      </div>

      {/* Center Image Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto max-w-xl mx-auto">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-emerald-950/30 shadow-2xl backdrop-blur-sm group transition-transform duration-500 hover:scale-[1.01]">
          <Image
            src="/login-bg.png"
            alt="School Admin Management System Dashboard Preview"
            fill
            className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            priority
            sizes="(max-width: 1024px) 0vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-emerald-200">
            Simplify School Operations
          </h1>
          <p className="mt-3 text-teal-100/80 text-sm leading-relaxed max-w-md mx-auto">
            Consolidating classroom scheduling, student enrollments, and inventory management into a unified, secure database built for efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}

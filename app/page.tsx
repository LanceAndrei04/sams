import LoginVisual from "@/components/login-visual";
import LoginForm from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SAMS School Admin & Management System",
  description: "Secure administration and records manager Panghayaan Elementary School Admin Management System (SAMS).",
};

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-row">
      <LoginVisual />
      <LoginForm />
    </main>
  );
}


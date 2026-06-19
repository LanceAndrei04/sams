import { LoadingShell } from "@/components/ui/loading-shell";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-start p-6">
      <div className="flex w-full flex-col gap-6">
        <LoadingShell />
        <LoadingShell lines={5} />
      </div>
    </main>
  );
}

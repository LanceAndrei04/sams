import { LoadingShell } from "@/components/ui/loading-shell";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <LoadingShell lines={2} />
      <LoadingShell lines={8} />
    </div>
  );
}

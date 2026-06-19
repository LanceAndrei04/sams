import { LoadingShell } from "@/components/ui/loading-shell";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingShell lines={2} />
      <LoadingShell lines={4} />
    </div>
  );
}

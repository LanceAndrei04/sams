import { LoadingShell } from "@/components/ui/loading-shell";

export default function StudentDetailLoading() {
  return (
    <div className="space-y-6">
      <LoadingShell lines={2} />
      <LoadingShell lines={5} />
      <LoadingShell lines={5} />
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingShell({
  title = true,
  lines = 3,
  className,
}: {
  title?: boolean;
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-[24px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(226,231,233,0.82))] p-6 shadow-[10px_10px_24px_rgba(163,173,175,0.26),-10px_-10px_24px_rgba(255,255,255,0.86)]", className)}>
      {title ? <Skeleton className="h-8 w-48 rounded-full" /> : null}
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className={cn("h-4 rounded-full", index === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}

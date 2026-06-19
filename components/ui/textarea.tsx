import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-[20px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(224,230,231,0.76))] px-3 py-2 text-sm text-foreground shadow-[inset_3px_3px_8px_rgba(163,173,175,0.18),inset_-3px_-3px_8px_rgba(255,255,255,0.92)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

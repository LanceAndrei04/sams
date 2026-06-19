import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-[20px] text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantStyles = {
      default: "border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(224,230,231,0.8))] text-foreground shadow-[6px_6px_14px_rgba(163,173,175,0.38),-6px_-6px_14px_rgba(255,255,255,0.8)] hover:shadow-[4px_4px_10px_rgba(163,173,175,0.34),-4px_-4px_10px_rgba(255,255,255,0.86)]",
      primary: "bg-[linear-gradient(145deg,rgba(124,166,163,0.98),rgba(96,139,136,0.98))] text-white shadow-[10px_10px_18px_rgba(116,142,139,0.3),-8px_-8px_18px_rgba(255,255,255,0.42)] hover:brightness-[0.98]",
      destructive: "bg-[linear-gradient(145deg,rgba(255,140,155,0.98),rgba(231,103,122,0.98))] text-white shadow-[10px_10px_18px_rgba(184,111,122,0.26),-8px_-8px_18px_rgba(255,255,255,0.4)]",
      outline: "border border-white/80 bg-[linear-gradient(145deg,rgba(246,248,248,0.9),rgba(227,233,234,0.8))] text-foreground shadow-[6px_6px_14px_rgba(163,173,175,0.26),-6px_-6px_14px_rgba(255,255,255,0.8)]",
      secondary: "bg-[linear-gradient(145deg,rgba(226,232,244,0.92),rgba(208,218,233,0.82))] text-[#36506b] shadow-[6px_6px_14px_rgba(163,173,175,0.2),-6px_-6px_14px_rgba(255,255,255,0.82)]",
      ghost: "bg-transparent text-foreground hover:bg-white/40",
      link: "text-primary underline-offset-4 hover:underline",
    };
    
    const sizeStyles = {
      default: "h-11 px-5",
      sm: "h-10 rounded-lg px-3",
      lg: "h-12 rounded-[22px] px-8",
      icon: "h-10 w-10",
    };
    
    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

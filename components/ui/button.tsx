import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-[20px] text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]";
    
    const variantStyles = {
      default: "bg-white/92 text-foreground border border-white/80 hover:bg-white",
      primary: "bg-[rgba(62,168,159,0.95)] text-white shadow-[0_16px_30px_-20px_rgba(62,168,159,0.4)] hover:bg-[rgba(50,142,132,0.95)]",
      destructive: "bg-[#ff7a88] text-white hover:bg-[#ff5f72]",
      outline: "border border-white/70 bg-white/40 text-foreground hover:bg-white/70 backdrop-blur-sm",
      secondary: "bg-[rgba(145,199,192,0.24)] text-[#14564f] hover:bg-[rgba(145,199,192,0.32)]",
      ghost: "bg-transparent text-foreground hover:bg-white/50",
      link: "text-primary underline-offset-4 hover:underline",
    };
    
    const sizeStyles = {
      default: "h-11 px-5",
      sm: "h-10 rounded-lg px-3",
      lg: "h-12 rounded-[22px] px-8",
      icon: "h-10 w-10",
    };
    
    return (
      <button
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
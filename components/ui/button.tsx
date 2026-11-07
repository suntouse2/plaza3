"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "outlined" | "ghost";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-hover",
  secondary:
    "border border-card-border bg-surface-2 text-foreground hover:border-card-border-strong hover:bg-surface-3",
  outlined:
    "border border-card-border-strong text-foreground hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "h-10 w-10 p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Рендерит классы на дочернем элементе вместо <button> (напр. <Link>) */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", asChild = false, className, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

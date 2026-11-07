"use client";

import { forwardRef } from "react";
import { cn } from "./cn";

type Variant = "default" | "filled" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "w-full rounded-lg text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-subtle disabled:opacity-40 disabled:pointer-events-none aria-invalid:border-danger aria-invalid:ring-1 aria-invalid:ring-danger";

const variants: Record<Variant, string> = {
  default:
    "border border-card-border bg-background hover:border-card-border-strong focus:border-accent-border focus:ring-1 focus:ring-accent-border",
  filled:
    "border border-card-border bg-surface-2 hover:border-card-border-strong focus:border-accent-border focus:ring-1 focus:ring-accent-border",
  ghost:
    "rounded-none! border-0 border-b border-card-border-strong bg-transparent focus:border-accent-border",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-3.5 text-sm",
  lg: "h-12 px-4 text-[15px]",
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  inputSize?: Size;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", inputSize = "md", className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        base,
        variants[variant],
        variant !== "ghost" && sizes[inputSize],
        variant === "ghost" && sizes[inputSize].replace(/px-\S+/, ""),
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

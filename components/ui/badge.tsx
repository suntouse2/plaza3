import { cn } from "@/components/ui/cn";

type Variant =
  | "default"
  | "accent"
  | "success"
  | "danger"
  | "discount"
  | "new"
  | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap leading-none";

const variants: Record<Variant, string> = {
  default: "bg-surface-3 text-muted",
  accent: "bg-accent text-accent-fg",
  success: "bg-success-soft text-success",
  danger: "bg-danger-strong text-white",
  discount: "bg-danger-strong text-white",
  new: "bg-info text-background",
  outline: "border border-card-border-strong text-muted",
};

const sizes: Record<Size, string> = {
  sm: "px-1.5 py-1 text-[10px]",
  md: "px-2 py-1.5 text-[11px]",
  lg: "px-2.5 py-1.5 text-xs",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
}

export function Badge({
  variant = "default",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

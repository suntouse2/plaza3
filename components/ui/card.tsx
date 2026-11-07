import { cn } from "./cn";

type Variant = "default" | "interactive" | "ghost";

const variants: Record<Variant, string> = {
  default: "border border-card-border bg-surface",
  interactive:
    "border border-card-border bg-surface transition-colors duration-150 hover:border-card-border-strong hover:bg-surface-2 cursor-pointer",
  ghost: "bg-surface-2",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl p-4", variants[variant], className)}
      {...props}
    />
  );
}

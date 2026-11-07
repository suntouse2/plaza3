import { cn } from "./cn";

type Variant = "default" | "text" | "circle" | "card";

const variants: Record<Variant, string> = {
  default: "rounded-lg",
  text: "rounded h-4",
  circle: "rounded-full",
  card: "rounded-xl",
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Skeleton({
  variant = "default",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-2",

        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite]",
        "before:bg-linear-to-r before:from-transparent before:via-white/6 before:to-transparent",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

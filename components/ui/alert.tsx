import type { LucideIcon } from "lucide-react";
import { cn } from "./cn";

type Variant = "info" | "success" | "warning" | "danger";
type Size = "sm" | "md" | "lg";

/** Цвет иконки + кружка под неё (только это несёт цвет варианта) */
const accent: Record<Variant, string> = {
  info: "text-info bg-info/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-danger bg-danger/10",
};

const sizes: Record<Size, { box: string; badge: string; icon: string }> = {
  sm: { box: "gap-2.5 p-3 text-xs", badge: "h-7 w-7", icon: "h-3.5 w-3.5" },
  md: { box: "gap-3 p-3.5 text-sm", badge: "h-9 w-9", icon: "h-4.5 w-4.5" },
  lg: { box: "gap-3.5 p-4 text-base", badge: "h-11 w-11", icon: "h-5 w-5" },
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  title?: string;
}

export function Alert({
  variant = "info",
  size = "md",
  icon: Icon,
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const s = sizes[size];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start rounded-xl border border-card-border-strong bg-surface-2",
        s.box,
        className
      )}
      {...props}
    >
      {Icon && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg",
            accent[variant],
            s.badge
          )}
        >
          <Icon className={s.icon} />
        </span>
      )}
      <div className="min-w-0 flex-1 self-center">
        {title && <p className="font-semibold text-foreground">{title}</p>}
        {children && (
          <div className={cn(title && "mt-0.5", "text-muted")}>{children}</div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { cn } from "./ui";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-display grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-[15px] font-bold text-accent-fg",
        className,
      )}
    >
      G
    </span>
  );
}

export default function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="GameDrop — на главную"
      className={cn("flex shrink-0 items-center gap-2.5", className)}
    >
      <LogoMark />
      <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
        GameDrop
      </span>
    </Link>
  );
}

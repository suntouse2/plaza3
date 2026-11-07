import { BadgeCheck, ShieldCheck, Timer } from "lucide-react";
import { cn } from "./ui";

const ITEMS = [
  { icon: Timer, title: "~2 минуты", desc: "среднее время доставки" },
  { icon: BadgeCheck, title: "Официально", desc: "пополнение по UID" },
  {
    icon: ShieldCheck,
    title: "Безопасная сделка",
    desc: "вернём средства при проблеме",
  },
];

export default function TrustStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 divide-y divide-card-border rounded-xl border border-card-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0",
        className
      )}
    >
      {ITEMS.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="flex items-center gap-3 px-4 py-3">
          <Icon className="h-5 w-5 shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            <p className="truncate text-xs text-muted">{desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

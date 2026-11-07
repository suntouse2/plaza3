"use client";

import { Button, cn } from "@/components/ui";
import { PlasmiteIcon } from "@/components/plasmite-icon";
import { ArrowRight } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import { useAppStore } from "@/store/useAppStore";

type Props = {
  className?: string;
};

const PERKS = [
  { title: "+5% бонус", desc: "к каждому пополнению" },
  { title: "1 плазмит = 1 ₽", desc: "без скрытых курсов" },
  { title: "В один клик", desc: "оплата с баланса" },
];

export default function PlasmitePromo({ className }: Props) {
  const state = useSessionStore((state) => state.state);
  const setAuthDialogState = useSessionStore(
    (state) => state.setAuthDialogState
  );
  const setAuthDialogType = useSessionStore((state) => state.setAuthDialogType);
  const setTopupDialogOpen = useAppStore((state) => state.setTopupDialogOpen);

  const handleTopUp = () => {
    if (state === "authenticated") {
      setTopupDialogOpen(true);
    } else {
      setAuthDialogState(true);
      setAuthDialogType("login");
    }
  };

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-card-border bg-surface",
        className
      )}
    >
      {/* Декор: крупная иконка справа */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 -z-10 hidden -translate-y-1/2 md:block"
      >
        <div className="absolute inset-0 m-auto h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <PlasmiteIcon className="relative h-72 w-72 opacity-90" />
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8 md:max-w-[62%] lg:p-10">
        <div className="flex flex-col gap-3">
          <span className="flex w-fit items-center gap-1.5 text-xs font-semibold text-accent">
            <PlasmiteIcon className="h-4 w-4" />
            Плазмиты
          </span>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
            Пополняйте баланс и платите плазмитами
          </h2>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {PERKS.map((p) => (
            <li
              key={p.title}
              className="flex flex-col gap-1 border-l-2 border-accent/60 pl-3"
            >
              <span className="num text-base font-bold">{p.title}</span>
              <span className="text-xs text-muted">{p.desc}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={handleTopUp}
          disabled={state === "loading"}
          className="group w-full sm:w-fit"
          size="lg"
        >
          {state === "authenticated" ? "Пополнить баланс" : "Войти и пополнить"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </section>
  );
}

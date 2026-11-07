"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CornerDownLeft, Search } from "lucide-react";
import type { Game } from "@/app/generated/prisma/client";
import { cn } from "./ui";

export type NavGame = Pick<Game, "slug" | "title" | "bannerUrl">;

/** Кнопка-триггер поиска (десктоп — поле, мобилка — иконка) + диалог */
export default function GameSearch({
  games,
  compact = false,
}: {
  games: NavGame[];
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Ctrl/⌘ + K — открыть поиск (слушаем только в десктопном экземпляре)
  useEffect(() => {
    if (compact) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        {compact ? (
          <button
            aria-label="Поиск игры"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-card-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        ) : (
          <button className="group flex h-10 w-full max-w-[340px] cursor-pointer items-center gap-2.5 rounded-lg border border-card-border bg-surface px-3 text-sm text-subtle transition-colors hover:border-card-border-strong">
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Найти игру</span>
            <kbd className="rounded border border-card-border-strong px-1.5 py-0.5 font-sans text-[10px] font-semibold text-subtle">
              Ctrl K
            </kbd>
          </button>
        )}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/70" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="dialog-content fixed inset-x-3 top-3 z-50 mx-auto max-w-xl overflow-hidden rounded-xl border border-card-border bg-surface shadow-2xl shadow-black/60 sm:top-[12vh]"
        >
          <DialogPrimitive.Title className="sr-only">
            Поиск игры
          </DialogPrimitive.Title>
          {open && (
            <SearchBody games={games} onDone={() => setOpen(false)} />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function SearchBody({
  games,
  onDone,
}: {
  games: NavGame[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? games.filter((g) => g.title.toLowerCase().includes(q)) : games;
  }, [games, query]);

  const go = (slug: string) => {
    onDone();
    router.push(`/game/${slug}`);
  };

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].slug);
    }
  }

  return (
    <div onKeyDown={onKeyDown}>
      <div className="flex items-center gap-3 border-b border-card-border px-4">
        <Search className="h-4 w-4 shrink-0 text-subtle" />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder="Название игры"
          className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
        />
        <DialogPrimitive.Close className="shrink-0 cursor-pointer rounded border border-card-border-strong px-1.5 py-0.5 text-[10px] font-semibold text-subtle">
          Esc
        </DialogPrimitive.Close>
      </div>

      <div className="scrollbar-thin max-h-[min(420px,60dvh)] overflow-y-auto p-2">
        {results.length === 0 ? (
          <p className="px-3 py-10 text-center text-sm text-muted">
            Ничего не найдено по запросу «{query}»
          </p>
        ) : (
          <ul>
            {results.map((g, i) => (
              <li key={g.slug}>
                <button
                  onClick={() => go(g.slug)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    "flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-2 text-left text-sm font-medium",
                    i === active ? "bg-surface-2 text-foreground" : "text-muted"
                  )}
                >
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-surface-3">
                    {g.bannerUrl && (
                      <Image
                        src={g.bannerUrl}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="flex-1 truncate">{g.title}</span>
                  {i === active && (
                    <CornerDownLeft className="h-4 w-4 text-subtle" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

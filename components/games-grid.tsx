"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game, GameType } from "@/app/generated/prisma/client";
import { Badge, Input, cn } from "@/components/ui";
import {
  Crosshair,
  Sparkles,
  Swords,
  Gamepad2,
  Dices,
  Search,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPE_META: Record<GameType, { label: string; icon: LucideIcon }> = {
  SHOOTER: { label: "Шутеры", icon: Crosshair },
  GACHA: { label: "Гача / RPG", icon: Sparkles },
  MOBS: { label: "MOBA", icon: Swords },
  CASUAL: { label: "Казуальные", icon: Dices },
  OTHER: { label: "Другое", icon: Gamepad2 },
};

type Filter = GameType | "ALL";

export default function GamesGrid({ games }: { games: Game[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const presentTypes = useMemo(() => {
    const set = new Set<GameType>();
    games.forEach((g) => set.add(g.type));
    return (Object.keys(TYPE_META) as GameType[]).filter((t) => set.has(t));
  }, [games]);

  const countFor = (f: Filter) =>
    f === "ALL" ? games.length : games.filter((g) => g.type === f).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games
      .filter((g) => (filter === "ALL" ? true : g.type === filter))
      .filter((g) => (q ? g.title.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
  }, [games, filter, query]);

  return (
    <section id="catalog" className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Каталог</p>
          <h2 className="font-display mt-1 text-2xl font-semibold sm:text-[28px]">
            Все игры
            <span className="num ml-2 align-top text-sm font-medium text-subtle">
              {games.length}
            </span>
          </h2>
        </div>
      </div>

      {/* Панель: поиск + фильтры (липнет под шапкой) */}
      <div className="sticky top-(--header-h) z-30 -mx-4 flex flex-col gap-3 border-b border-card-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:flex-row md:items-center lg:-mx-8 lg:px-8">
        <div className="relative shrink-0 md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input
            variant="filled"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по каталогу"
            aria-label="Поиск по каталогу"
            className="h-10! pl-9"
          />
        </div>
        <div
          role="tablist"
          aria-label="Жанр"
          className="fade-x -mx-4 flex flex-1 gap-1.5 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0 md:[mask-image:none]"
        >
          <TagButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            icon={Zap}
            label="Все"
            count={countFor("ALL")}
          />
          {presentTypes.map((t) => (
            <TagButton
              key={t}
              active={filter === t}
              onClick={() => setFilter(t)}
              icon={TYPE_META[t].icon}
              label={TYPE_META[t].label}
              count={countFor(t)}
            />
          ))}
        </div>
      </div>

      {/* Сетка обложек */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} priority={i < 6} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-card-border-strong px-6 py-16 text-center">
          <Search className="h-6 w-6 text-subtle" />
          <p className="text-sm text-muted">
            Ничего не найдено{query ? ` по запросу «${query}»` : ""}
          </p>
          <button
            onClick={() => {
              setQuery("");
              setFilter("ALL");
            }}
            className="cursor-pointer text-sm font-semibold text-accent hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </section>
  );
}

/* ---------- Тег-фильтр ---------- */
function TagButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count: number;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[13px] font-semibold transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-card-border text-muted hover:border-card-border-strong hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      <span
        className={cn(
          "num text-[11px] font-medium",
          active ? "text-background/60" : "text-subtle"
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ---------- Карточка: портретная обложка + подпись ---------- */
function GameCard({ game, priority }: { game: Game; priority?: boolean }) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className="group flex flex-col gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-card-border bg-surface transition-colors group-hover:border-card-border-strong">
        {game.bannerUrl && (
          <Image
            src={game.bannerUrl}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            preload={priority}
          />
        )}
        {(game.isPopular || game.isNew) && (
          <div className="absolute left-2 top-2 flex gap-1">
            {game.isNew && (
              <Badge variant="accent" size="sm">
                NEW
              </Badge>
            )}
            {game.isPopular && (
              <Badge size="sm" className="bg-black/70 text-white backdrop-blur">
                ХИТ
              </Badge>
            )}
          </div>
        )}
        <div className="absolute inset-x-2 bottom-2 flex translate-y-1 items-center justify-center rounded-lg bg-accent py-2 text-xs font-semibold text-accent-fg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          Пополнить
        </div>
      </div>

      <div className="min-w-0 px-0.5">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {game.title}
        </h3>
        <p className="truncate text-xs text-subtle">
          {TYPE_META[game.type]?.label ?? "Игра"}
        </p>
      </div>
    </Link>
  );
}

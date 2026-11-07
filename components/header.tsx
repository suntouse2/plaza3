"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { supportLink } from "@/data/shared";
import { useAppStore } from "@/store/useAppStore";
import Logo from "./logo";
import GameSearch, { type NavGame } from "./game-search";
import { AccountMenu, MobileBalance } from "./profile";
import { cn } from "./ui";

export const NAV_LINKS = [
  { label: "Каталог", href: "/#catalog" },
  { label: "Поддержка", href: supportLink, external: true },
];

export default function Header({ games }: { games: NavGame[] }) {
  const pathname = usePathname();
  const setIsSidebarOpen = useAppStore((s) => s.setIsSidebarOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-(--header-h) w-full max-w-[1320px] items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <Logo />

        {/* Навигация — десктоп */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = !l.external && l.href === pathname;
            return (
              <Link
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden min-w-0 flex-1 justify-end md:flex lg:justify-center">
          <GameSearch games={games} />
        </div>

        <div className="hidden lg:block">
          <AccountMenu />
        </div>

        {/* Мобилка / планшет */}
        <div className="ml-auto flex items-center gap-2 md:ml-0 lg:hidden">
          <MobileBalance />
          <div className="md:hidden">
            <GameSearch games={games} compact />
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Открыть меню"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-card-border bg-surface text-foreground"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}

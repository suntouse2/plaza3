"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import Profile from "./profile";
import Logo from "./logo";
import { NAV_LINKS } from "./header";
import type { NavGame } from "./game-search";
import { cn } from "./ui";

/** Мобильное меню (до lg): профиль, игры, ссылки */
export default function Sidebar({ games }: { games: NavGame[] }) {
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen);
  const setIsSidebarOpen = useAppStore((s) => s.setIsSidebarOpen);
  const pathname = usePathname();
  const close = () => setIsSidebarOpen(false);

  // Блокируем прокрутку страницы под открытым меню
  useEffect(() => {
    if (!isSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSidebarOpen]);

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <div key="menu" className="lg:hidden">
          <motion.div
            key="backdrop"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col border-l border-card-border bg-background"
          >
            <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-card-border px-4">
              <Logo onClick={close} />
              <button
                onClick={close}
                aria-label="Закрыть меню"
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-card-border bg-surface"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
              <Profile />

              <p className="eyebrow mb-2 mt-6 px-1">Игры</p>
              <ul className="grid grid-cols-1 gap-0.5 min-[440px]:grid-cols-2">
                {games.map((game) => {
                  const href = `/game/${game.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={game.slug}>
                      <Link
                        href={href}
                        onClick={close}
                        className={cn(
                          "flex h-12 items-center gap-3 rounded-lg px-2 text-sm transition-colors",
                          active
                            ? "bg-surface-2 font-semibold text-foreground"
                            : "font-medium text-muted hover:bg-surface hover:text-foreground",
                        )}
                      >
                        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-surface-2">
                          {game.bannerUrl && (
                            <Image
                              src={game.bannerUrl}
                              alt=""
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span className="truncate">{game.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="eyebrow mb-2 mt-6 px-1">GamerPlaza</p>
              <ul className="flex flex-col gap-0.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      onClick={close}
                      className="flex h-12 items-center justify-between rounded-lg px-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {l.label}
                      {l.external && <ArrowUpRight className="h-4 w-4" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

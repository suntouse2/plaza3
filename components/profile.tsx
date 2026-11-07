"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy, LogIn, LogOut, Plus } from "lucide-react";
import { Button, cn } from "./ui";
import { useSessionStore } from "@/store/useSessionStore";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/toast";
import { useAppStore } from "@/store/useAppStore";
import { PlasmiteIcon } from "./plasmite-icon";

/** Общая логика профиля: состояние сессии и действия */
function useProfile() {
  const state = useSessionStore((state) => state.state);
  const user = useSessionStore((state) => state.user);
  const setAuthDialogState = useSessionStore(
    (state) => state.setAuthDialogState
  );
  const setAuthDialogType = useSessionStore((state) => state.setAuthDialogType);
  const logout = useSessionStore((state) => state.logout);
  const setTopupDialogOpen = useAppStore((state) => state.setTopupDialogOpen);

  const handleLogin = () => {
    setAuthDialogState(true);
    setAuthDialogType("login");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user?.id || "");
    toast.success({ title: "ID скопирован в буфер обмена" });
  };

  return {
    state,
    user,
    handleLogin,
    handleCopyId,
    logout,
    openTopup: () => setTopupDialogOpen(true),
  };
}

function shortId(id?: string) {
  if (!id) return "";
  return `#${id.slice(0, 1)}…${id.slice(-4)}`;
}

function Avatar({ id, className }: { id?: string; className?: string }) {
  return (
    <span
      className={cn(
        "font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-semibold text-foreground",
        className
      )}
    >
      {id?.charAt(0).toUpperCase()}
    </span>
  );
}

/* ---------- Шапка (десктоп): баланс + меню аккаунта ---------- */
export function AccountMenu() {
  const { state, user, handleLogin, handleCopyId, logout, openTopup } =
    useProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (state === "loading") {
    return <Skeleton className="h-10 w-44 rounded-lg" />;
  }

  if (state === "unauthenticated") {
    return (
      <Button onClick={handleLogin} variant="secondary" size="sm" className="h-10">
        <LogIn className="h-4 w-4" />
        Войти
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <BalancePill balance={user?.balance ?? 0} onTopup={openTopup} />

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Меню аккаунта"
          className={cn(
            "flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-card-border pl-1 pr-2 transition-colors hover:border-card-border-strong hover:bg-surface-2",
            open && "border-card-border-strong bg-surface-2"
          )}
        >
          <Avatar id={user?.id} />
          <ChevronDown
            className={cn(
              "h-4 w-4 text-subtle transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-card-border bg-surface shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="flex items-center gap-3 border-b border-card-border p-3">
              <Avatar id={user?.id} className="h-10 w-10 text-sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {shortId(user?.id)}
                </p>
                <p className="num flex items-center gap-1 text-xs text-muted">
                  <PlasmiteIcon className="h-3 w-3" />
                  {user?.balance.toLocaleString("ru-RU")} плазмитов
                </p>
              </div>
            </div>
            <div className="flex flex-col p-1">
              <MenuItem
                icon={Plus}
                label="Пополнить баланс"
                onClick={() => {
                  setOpen(false);
                  openTopup();
                }}
              />
              <MenuItem
                icon={Copy}
                label="Скопировать ID"
                onClick={() => {
                  setOpen(false);
                  handleCopyId();
                }}
              />
              <div className="my-1 h-px bg-card-border" />
              <MenuItem
                icon={LogOut}
                label="Выйти"
                danger
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Plus;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left text-sm font-medium transition-colors hover:bg-surface-2",
        danger ? "text-danger" : "text-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ---------- Баланс с кнопкой пополнения ---------- */
export function BalancePill({
  balance,
  onTopup,
  className,
}: {
  balance: number;
  onTopup: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-lg border border-card-border bg-surface pl-3",
        className
      )}
    >
      <PlasmiteIcon className="h-4 w-4" />
      <span className="num ml-1.5 mr-2 text-sm font-semibold">
        {balance.toLocaleString("ru-RU")}
      </span>
      <button
        onClick={onTopup}
        aria-label="Пополнить баланс"
        className="m-1 grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-accent text-accent-fg transition-colors hover:bg-accent-hover"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------- Компактный баланс для мобильной шапки ---------- */
export function MobileBalance() {
  const { state, user, openTopup } = useProfile();
  if (state !== "authenticated" || !user) return null;
  return (
    <button
      onClick={openTopup}
      aria-label="Пополнить баланс"
      className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-card-border bg-surface px-2.5 text-sm font-semibold"
    >
      <PlasmiteIcon className="h-4 w-4" />
      <span className="num">{user.balance.toLocaleString("ru-RU")}</span>
      <Plus className="h-3.5 w-3.5 text-accent" />
    </button>
  );
}

/* ---------- Блок профиля (мобильное меню) ---------- */
export default function Profile() {
  const { state, user, handleLogin, handleCopyId, logout, openTopup } =
    useProfile();

  if (state === "loading") {
    return <Skeleton variant="card" className="h-[116px] w-full" />;
  }

  if (state === "unauthenticated") {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-card-border bg-surface p-4">
        <div>
          <p className="text-sm font-semibold">Войдите в аккаунт</p>
          <p className="mt-0.5 text-xs text-muted">
            Платите плазмитами и получайте бонусы
          </p>
        </div>
        <Button onClick={handleLogin} className="w-full">
          <LogIn className="h-4 w-4" />
          Войти
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-card-border bg-surface p-3">
      <div className="flex items-center gap-3">
        <Avatar id={user?.id} className="h-10 w-10 text-sm" />
        <div className="min-w-0 flex-1">
          <button
            onClick={handleCopyId}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold"
          >
            {shortId(user?.id)}
            <Copy className="h-3.5 w-3.5 text-subtle" />
          </button>
          <p className="num flex items-center gap-1 text-xs text-muted">
            <PlasmiteIcon className="h-3 w-3" />
            {user?.balance.toLocaleString("ru-RU")} плазмитов
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={logout}
          aria-label="Выйти"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <Button className="mt-3 w-full" onClick={openTopup}>
        <Plus className="h-4 w-4" />
        Пополнить баланс
      </Button>
    </div>
  );
}

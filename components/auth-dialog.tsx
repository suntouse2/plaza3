"use client";

import { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
} from "./ui";
import { Mail, Lock, Send, Loader2 } from "lucide-react";
import { PlasmiteIcon } from "./plasmite-icon";
import Link from "next/link";
import { supportLink } from "@/data/shared";
import { useSessionStore } from "@/store/useSessionStore";
import { AdaptiveDialog } from "./ui/adaptive-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AuthDialog({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuthDialogType = useSessionStore((state) => state.setAuthDialogType);
  const login = useSessionStore((state) => state.login);
  const state = useSessionStore((state) => state.state);
  const canSubmit = email.trim().length > 3 && password.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  function handleTelegram() {
    // TODO: подключи Telegram Login (signIn("telegram") / виджет)
    console.log("telegram login");
  }

  return (
    <AdaptiveDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Войти</DialogTitle>
        <DialogDescription className="text-sm text-muted">
          <PlasmiteIcon className="inline-block w-4 mr-1" />
          Платите плазмитами и получайте скидки с бонусами
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email */}
        <label className="flex flex-col gap-1.5">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              type="email"
              disabled={state === "loading"}
              value={email}
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="pl-9"
              autoComplete="email"
            />
          </div>
        </label>

        {/* Пароль */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Пароль</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              variant="filled"
              disabled={state === "loading"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className="pl-9"
              autoComplete="current-password"
            />
          </div>
        </label>

        <Link
          aria-disabled={state === "loading"}
          href={
            supportLink +
            "?text=Здравствуйте, я забыл пароль от моего аккаунта GamerPlaza"
          }
          type="button"
          className={`-mt-1 ${
            state === "loading" ? "opacity-40 pointer-events-none" : ""
          } cursor-pointer self-end text-xs transition-colors text-white/50 hover:text-white/70`}
        >
          Забыли пароль?
        </Link>

        <Button
          type="submit"
          disabled={!canSubmit || state === "loading"}
          className="mt-1"
        >
          {state === "loading" ? (
            <Loader2 className="animate-spin w-4" />
          ) : (
            "Войти"
          )}
        </Button>
      </form>

      {/* Разделитель */}
      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-card-border" />
        <span className="text-xs text-subtle">или</span>
        <span className="h-px flex-1 bg-card-border" />
      </div>

      {/* Telegram */}
      <Button
        type="button"
        variant="secondary"
        onClick={handleTelegram}
        className="w-full"
        disabled={state === "loading"}
      >
        <Send className="h-4 w-4 text-[#27a7e7]" />
        Войти через Telegram
      </Button>

      {/* Регистрация */}
      <p className="mt-4 text-center text-xs text-muted">
        Нет аккаунта?{" "}
        <Button
          variant="ghost"
          size="sm"
          disabled={state === "loading"}
          onClick={() => {
            setAuthDialogType("register");
          }}
          type="button"
          className="font-medium hover:bg-transparent! p-0! ml-1 cursor-pointer text-accent-text! transition-colors hover:text-accent!"
        >
          Зарегистрироваться
        </Button>
      </p>
    </AdaptiveDialog>
  );
}

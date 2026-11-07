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
import { useSessionStore } from "@/store/useSessionStore";
import { AdaptiveDialog } from "./ui/adaptive-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: () => void;
};

export default function RegisterDialog({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const state = useSessionStore((state) => state.state);
  const register = useSessionStore((state) => state.register);
  const setAuthDialogType = useSessionStore((state) => state.setAuthDialogType);

  const emailOk = email.trim().length > 3 && email.includes("@");
  const passOk = password.length >= 6;
  const matchOk = confirm.length > 0 && confirm === password;
  const canSubmit = emailOk && passOk && matchOk;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    register(email, password);
  }

  function handleTelegram() {
    // TODO: подключи Telegram Login
    console.log("telegram register");
  }

  return (
    <AdaptiveDialog open={open} onOpenChange={onOpenChange} size="sm">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Регистрация</DialogTitle>
        <DialogDescription className="text-sm text-muted">
          <PlasmiteIcon className="mr-1 inline-block w-4" />
          Создайте аккаунт, копите плазмиты и получайте скидки
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email */}
        <label className="flex flex-col gap-1.5">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              type="email"
              variant="filled"
              value={email}
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
              type="password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className="pl-9"
              autoComplete="new-password"
            />
          </div>
        </label>

        {/* Подтверждение пароля */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">
            Повторите пароль
          </span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              type="password"
              variant="filled"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ещё раз пароль"
              className="pl-9"
              autoComplete="new-password"
            />
          </div>
          {confirm.length > 0 && !matchOk && (
            <span className="text-xs text-danger">Пароли не совпадают</span>
          )}
        </label>

        <Button
          type="submit"
          disabled={!canSubmit || state === "loading"}
          className="mt-1"
        >
          {state === "loading" ? (
            <Loader2 className="animate-spin w-4" />
          ) : (
            "Зарегистрироваться"
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
      >
        <Send className="h-4 w-4 text-[#27a7e7]" />
        Зарегистрироваться через Telegram
      </Button>

      {/* На вход */}
      <p className="mt-4 text-center text-xs text-muted">
        Уже есть аккаунт?{" "}
        <Button
          variant="ghost"
          size="sm"
          disabled={state === "loading"}
          onClick={() => {
            setAuthDialogType("login");
          }}
          type="button"
          className="font-medium hover:bg-transparent! p-0! ml-1 cursor-pointer text-accent-text! transition-colors hover:text-accent!"
        >
          Войти
        </Button>
      </p>
    </AdaptiveDialog>
  );
}

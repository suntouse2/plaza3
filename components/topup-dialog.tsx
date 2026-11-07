"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DialogHeader,
  DialogTitle,
  Input,
  Button,
  Card,
  Badge,
  cn,
} from "./ui";
import { Loader2 } from "lucide-react";
import { PlasmiteIcon } from "./plasmite-icon";
import { AdaptiveDialog } from "./ui/adaptive-dialog";
import { useSessionStore } from "@/store/useSessionStore";
import { toast } from "./ui/toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type PayMethod = "sbp" | "card";

const PAY_METHODS: {
  id: PayMethod;
  label: string;
  icon: React.ReactElement;
}[] = [
  {
    id: "sbp",
    label: "СБП",
    icon: <Image src="/pay/sbp.svg" alt="СБП" width={40} height={40} />,
  },
  {
    id: "card",
    label: "Картой",
    icon: <Image src="/pay/cards.png" alt="Картой" width={30} height={30} />,
  },
];

const PRESETS = [500, 1000, 2500, 5000];
const MIN_AMOUNT = 100;
const BONUS_RATE = 0.05; // +5% плазмитов

// Форматирование рублей: копейки показываются только если они есть
function formatRub(n: number) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function TopUpDialog({ open, onOpenChange }: Props) {
  const state = useSessionStore((s) => s.state);
  const user = useSessionStore((s) => s.user);

  // Храним сырую строку, чтобы можно было печатать "100." и "100.50"
  const [amount, setAmount] = useState<string>("");
  const [payMethod, setPayMethod] = useState<PayMethod>("sbp");
  const [loading, setLoading] = useState(false);

  const numericAmount = amount === "" ? 0 : Number(amount) || 0;
  const bonus = Math.floor(numericAmount * BONUS_RATE * 100) / 100;
  const total = Math.round((numericAmount + bonus) * 100) / 100;
  const canSubmit = numericAmount >= MIN_AMOUNT && !loading;

  function handlePreset(value: number) {
    setAmount(String(value));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value
      .replace(/\s/g, "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "");

    // оставляем только одну точку
    const parts = raw.split(".");
    if (parts.length > 2) {
      raw = parts[0] + "." + parts.slice(1).join("");
    }

    // максимум 2 знака после точки
    const [int, dec] = raw.split(".");
    if (dec !== undefined) {
      raw = int + "." + dec.slice(0, 2);
    }

    setAmount(raw);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    if (state === "unauthenticated") {
      toast.danger({
        title: "Требуется вход",
        description: "Войдите в аккаунт, чтобы пополнить баланс",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(numericAmount * 100) / 100, // рубли с копейками
          paymentMethod: payMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.danger({ title: data.error ?? "Не удалось создать платёж" });
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      toast.success({ title: "Платёж создан" });
      onOpenChange(false);
    } catch {
      toast.danger({ title: "Ошибка при пополнении" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdaptiveDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Пополнение</DialogTitle>
      </DialogHeader>

      {/* Текущий баланс */}
      {state === "authenticated" && user && (
        <Card
          variant="ghost"
          className="flex items-center bg-transparent! justify-between rounded-xl p-0!"
        >
          <span className="text-sm text-muted">Ваш баланс</span>
          <span className="flex items-center gap-1.5 text-base font-bold">
            <PlasmiteIcon className="h-4 w-4" />
            {user.balance.toLocaleString("ru-RU")}
          </span>
        </Card>
      )}

      <div className="flex flex-col mt-4 gap-4">
        {/* Быстрые суммы */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold">Сумма пополнения</h4>
          <div className="relative">
            <PlasmiteIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              variant="filled"
              inputMode="decimal"
              value={amount}
              onChange={handleInput}
              placeholder={`сумма от ${MIN_AMOUNT} ₽`}
              disabled={loading}
              className="h-12! rounded-xl pl-9"
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESETS.map((value) => {
              const active = numericAmount === value;
              return (
                <Card
                  key={value}
                  onClick={() => handlePreset(value)}
                  className={cn(
                    "cursor-pointer p-2! bg-white/3! flex items-center justify-center text-sm font-semibold transition-colors",
                    active ? "bg-white/12! text-white" : "text-muted"
                  )}
                >
                  {value}
                </Card>
              );
            })}
          </div>

          {/* Ручной ввод */}

          {amount !== "" && numericAmount < MIN_AMOUNT && (
            <p className="px-1 text-xs text-danger">
              Минимальная сумма — {MIN_AMOUNT} ₽
            </p>
          )}
        </div>

        {/* Способ оплаты */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold">Способ оплаты</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {PAY_METHODS.map((m) => {
              const active = payMethod === m.id;
              return (
                <Card
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={cn(
                    "cursor-pointer p-2! bg-white/3! flex flex-col gap-2 items-center justify-center",
                    active && "bg-white/12!"
                  )}
                >
                  {m.icon}
                  <span
                    className={cn(
                      "text-[11px] font-semibold text-muted",
                      active && "text-white"
                    )}
                  >
                    {m.label}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Раскладка */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Сумма</span>
            <span className="font-semibold text-foreground">
              {formatRub(numericAmount)} ₽
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted">
              Бонус
              <Badge variant="discount" size="sm">
                +{Math.round(BONUS_RATE * 100)}%
              </Badge>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <PlasmiteIcon className="h-3.5 w-3.5" />+{formatRub(bonus)}
            </span>
          </div>
        </div>

        {/* Итого зачислится */}
        <Card className="flex items-center justify-between rounded-xl bg-card-filled px-4 py-3">
          <span className="text-base font-bold">Зачислим</span>
          <span className="flex items-center gap-1.5 text-xl font-extrabold">
            <PlasmiteIcon className="h-5 w-5" />
            {formatRub(total)}
          </span>
        </Card>

        {/* Кнопка */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-12! rounded-xl text-base font-bold disabled:bg-white/20!"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4" />
          ) : numericAmount >= MIN_AMOUNT ? (
            `Пополнить на ${formatRub(numericAmount)} ₽`
          ) : (
            "Пополнить"
          )}
        </Button>

        <p className="text-center text-[11px] leading-snug text-subtle">
          Нажимая «Пополнить», вы принимаете{" "}
          <a href="/terms" className="text-accent-text">
            Правила пользования сайтом
          </a>{" "}
          и{" "}
          <a href="/offer" className="text-accent-text">
            Договор публичной оферты
          </a>
        </p>
      </div>
    </AdaptiveDialog>
  );
}

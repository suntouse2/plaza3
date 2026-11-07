"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircleIcon, Loader2Icon } from "lucide-react";
import {
  Credential,
  CredentialType,
  Game,
  GameProduct,
} from "@/app/generated/prisma/client";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  cn,
} from "./ui";
import PromoInput from "./promo-input";
import { productDiscount } from "@/data/shared";

type Props = {
  product: GameProduct;
  game: Game;
  categoryTitle: string;
  credentials: Credential[];
};

type PayMethod = "sbp" | "card";

const METHODS: {
  id: PayMethod;
  label: string;
  icon: { src: string; width: number; height: number };
}[] = [
  {
    id: "sbp",
    label: "СБП",
    icon: { src: "/pay/sbp.svg", width: 40, height: 24 },
  },
  {
    id: "card",
    label: "Карта",
    icon: { src: "/pay/cards.png", width: 34, height: 20 },
  },
];

const DEFAULT_HINT =
  "Для пополнения нужны данные вашего аккаунта. Их можно найти в профиле или в настройках игры, в разделе «Мой аккаунт».";

const INPUT_TYPES: Partial<
  Record<
    CredentialType,
    Pick<React.ComponentProps<"input">, "type" | "inputMode">
  >
> = {
  CLIENT_ID: { inputMode: "numeric" },
  SERVER_ID: { inputMode: "numeric" },
  PASSWORD: { type: "password" },
  EMAIL: { type: "email", inputMode: "email" },
};

const REQUEST_TIMEOUT = 20_000;

const formatPrice = (value: number) =>
  `${Math.round(value).toLocaleString("ru-RU")} ₽`;

const isValid = (c: Credential, raw: string | undefined) =>
  !c.isRequired || !!raw?.trim();

export default function Receipt({
  product,
  game,
  categoryTitle,
  credentials,
}: Props) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [openHint, setOpenHint] = useState<number | null>(null);
  const [promo, setPromo] = useState<string | null>(null);
  const [method, setMethod] = useState<PayMethod>("sbp");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discount = productDiscount;
  const oldPrice = discount ? product.price / (1 - discount / 100) : null;

  const filled = credentials.every((c) => isValid(c, values[c.id]));
  const canSubmit = filled && !isLoading;

  const handlePay = async () => {
    if (!canSubmit) return;
    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const valueOf = (type: CredentialType) =>
        values[credentials.find((c) => c.type === type)?.id ?? -1]?.trim();

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          productId: product.id,
          clientId: valueOf("CLIENT_ID") ?? "",
          serverId: valueOf("SERVER_ID") || undefined,
          promo: promo ?? undefined,
          method,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.redirectUrl) {
        throw new Error(data?.error || "Не удалось создать платёж");
      }

      window.location.href = data.redirectUrl;
    } catch (e) {
      setIsLoading(false);
      setError(
        e instanceof DOMException && e.name === "AbortError"
          ? "Платёжная система не ответила вовремя. Попробуйте ещё раз."
          : e instanceof Error
            ? e.message
            : "Что-то пошло не так. Попробуйте ещё раз.",
      );
    } finally {
      clearTimeout(timer);
    }
  };

  const via = credentials.map((c, i) =>
    i === 0 ? c.label : c.label.charAt(0).toLowerCase() + c.label.slice(1),
  );

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-2.5 sm:gap-3">
        {/* product */}
        <div className="flex flex-col gap-3 rounded-3xl border border-card-border bg-card p-4 sm:gap-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-surface-2 sm:size-20">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5 sm:p-2"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-xs text-muted sm:text-sm">
                {game.title} · {categoryTitle}
              </span>
              <span className="text-lg font-bold sm:text-xl">
                Кейс {product.amount.toLocaleString("ru-RU")} {product.suffix}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {via.length > 0 && (
              <span className="rounded-lg bg-accent px-2 py-1 text-[10px] font-semibold uppercase text-accent-fg sm:px-2.5 sm:text-xs">
                Через {via.join(" и ")}
              </span>
            )}
            {discount && (
              <span className="rounded-lg bg-success-soft px-2 py-1 text-[10px] font-semibold uppercase text-success sm:px-2.5 sm:text-xs">
                Скидка −{discount}%
              </span>
            )}

            <span className="rounded-lg bg-gray-800 px-2 py-1 text-[10px] font-semibold uppercase text-gray-400 sm:px-2.5 sm:text-[10px]">
              Рандом
            </span>
          </div>
        </div>

        {/* credentials */}
        {credentials.length > 0 && (
          <div className="flex flex-col gap-2.5 rounded-3xl border border-card-border bg-surface-2 p-4 sm:gap-3 sm:p-5">
            {credentials.map((cred) => {
              const value = values[cred.id] ?? "";
              const hintOpen = openHint === cred.id;

              return (
                <div key={cred.id} className="flex flex-col gap-1.5">
                  <div className="relative">
                    <Input
                      value={value}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [cred.id]: e.target.value }))
                      }
                      placeholder={cred.label}
                      aria-label={cred.label}
                      disabled={isLoading}
                      {...INPUT_TYPES[cred.type]}
                      className="h-12 rounded-2xl bg-background pr-12 text-base placeholder:text-muted sm:h-14 sm:pr-32"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      aria-label="Где взять"
                      aria-expanded={hintOpen}
                      onClick={() => setOpenHint(hintOpen ? null : cred.id)}
                      className="absolute top-1/2 right-1.5 -translate-y-1/2 px-2 sm:right-2 sm:px-3.5"
                    >
                      <span className="hidden sm:inline">Где взять</span>
                      <HelpCircleIcon className="size-4" />
                    </Button>
                  </div>
                  {hintOpen &&
                    (cred.instructionHtml ? (
                      <div
                        className="rounded-2xl bg-surface-3 px-4 py-3 text-sm text-muted"
                        dangerouslySetInnerHTML={{
                          __html: cred.instructionHtml,
                        }}
                      />
                    ) : (
                      <p className="rounded-2xl bg-surface-3 px-4 py-3 text-sm text-muted">
                        {DEFAULT_HINT}
                      </p>
                    ))}
                </div>
              );
            })}
          </div>
        )}

        {/* checkout */}
        <div className="flex flex-col gap-3 rounded-3xl border border-card-border bg-card p-4 sm:gap-4 sm:p-5">
          <PromoInput onValidChange={setPromo} />

          {/* payment method */}
          <div
            role="radiogroup"
            aria-label="Способ оплаты"
            className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1"
          >
            {METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={isLoading}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  <Image
                    src={m.icon.src}
                    alt=""
                    width={m.icon.width}
                    height={m.icon.height}
                    className={cn(
                      "shrink-0 transition-opacity",
                      !active && "opacity-60",
                    )}
                  />
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="num flex flex-col gap-1.5 px-1 text-sm">
            {oldPrice && (
              <>
                <div className="flex justify-between text-muted">
                  <span>Цена</span>
                  <span className="line-through">{formatPrice(oldPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Выгода</span>
                  <span className="font-semibold text-success">
                    −{formatPrice(oldPrice - product.price)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Время доставки</span>
              <span className="font-semibold">до 5 мин.</span>
            </div>
          </div>

          <div className="num flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 sm:px-5 sm:py-4">
            <span className="font-bold">Итого</span>
            <span className="text-xl font-bold sm:text-2xl">
              {formatPrice(product.price)}
            </span>
          </div>

          <Button
            size="lg"
            onClick={handlePay}
            disabled={!canSubmit}
            className={cn(
              "num h-12 rounded-2xl bg-success text-base text-accent-fg hover:bg-success/90 sm:h-14",
            )}
          >
            Оплатить {formatPrice(product.price)}
          </Button>

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <p className="text-center text-[11px] leading-relaxed text-subtle sm:text-xs">
            Оформляя заказ, вы подтверждаете согласие с{" "}
            <Link href="/privacy" className="text-accent-text hover:underline">
              Политикой в отношении обработки персональных данных
            </Link>{" "}
            и условиями{" "}
            <Link href="/eula" className="text-accent-text hover:underline">
              Пользовательского соглашения
            </Link>
            .
          </p>
        </div>
      </div>

      {/* non-closable loading modal */}
      <Dialog open={isLoading}>
        <DialogContent
          size="sm"
          showClose={false}
          dismissable={false}
          className="flex max-w-xs flex-col items-center gap-4 rounded-3xl py-10 text-center"
        >
          <Loader2Icon className="size-10 animate-spin text-accent" />
          <DialogTitle className="text-lg font-bold">
            Создаём платёж
          </DialogTitle>
          <DialogDescription className="text-sm text-muted">
            Сейчас вы будете перенаправлены на страницу оплаты. Не закрывайте
            вкладку.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}

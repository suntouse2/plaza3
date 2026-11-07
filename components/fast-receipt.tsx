/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Game, GameProduct, Credential } from "@/app/generated/prisma/client";
import { Button, Input, Select, Option, cn, Badge } from "@/components/ui";
import { Zap } from "lucide-react";
import PromoInput from "./promo-input";
import { toast } from "./ui/toast";
import { useRouter } from "next/navigation";

type Props = {
  games: Game[];
};

const OLD_PRICE_MULT = 1.54; // ~ -35%

type Status = "idle" | "loading" | "success" | "error";

// Загрузка продуктов по игре
function useProducts(gameId: string | undefined) {
  const [products, setProducts] = useState<GameProduct[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!gameId) {
      setProducts([]);
      setStatus("idle");
      return;
    }
    const ctrl = new AbortController();
    setStatus("loading");
    (async () => {
      try {
        const res = await fetch(`/api/products?gameId=${gameId}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameProduct[] = await res.json();
        setProducts(data);
        setStatus("success");
      } catch {
        if (ctrl.signal.aborted) return; // устаревший запрос — игнор
        setProducts([]);
        setStatus("error");
      }
    })();
    return () => ctrl.abort();
  }, [gameId]);

  return { products, status };
}

// Загрузка credentials по продукту
function useCredentials(productId: string | undefined) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!productId) {
      setCredentials([]);
      setStatus("idle");
      return;
    }
    const ctrl = new AbortController();
    setStatus("loading");
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}/credentials`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Credential[] = await res.json();
        setCredentials(data);
        setStatus("success");
      } catch {
        if (ctrl.signal.aborted) return;
        setCredentials([]);
        setStatus("error");
      }
    })();
    return () => ctrl.abort();
  }, [productId]);

  return { credentials, status };
}

export default function FastReceipt({ games }: Props) {
  const router = useRouter();
  const [selectedGameId, setSelectedGameId] = useState<string | undefined>(
    games[0]?.id,
  );
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [fields, setFields] = useState<Record<number, string>>({});
  const [promo, setPromo] = useState("");

  const selectedGame = useMemo(
    () => games.find((g) => g.id === selectedGameId) ?? null,
    [games, selectedGameId],
  );

  const { products, status: productsStatus } = useProducts(selectedGameId);
  const { credentials, status: credentialsStatus } =
    useCredentials(selectedProductId);

  // Когда продукты загрузились — выбираем первый по умолчанию.
  // Если текущий выбранный продукт не из этого набора — сбрасываем.
  useEffect(() => {
    if (productsStatus !== "success") return;
    setSelectedProductId((prev) => {
      if (prev && products.some((p) => p.id === prev)) return prev;
      return products[0]?.id;
    });
  }, [products, productsStatus]);

  // Сбрасываем введённые поля при смене продукта
  useEffect(() => {
    setFields({});
  }, [selectedProductId]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  const fieldsValid = useMemo(() => {
    return credentials.every((c) => {
      const val = fields[c.id]?.trim() ?? "";
      if (!c.isRequired && val === "") return true;
      try {
        return new RegExp(c.regex).test(val);
      } catch {
        return val.length > 0;
      }
    });
  }, [credentials, fields]);

  const canPay =
    !!selectedProduct && credentialsStatus === "success" && fieldsValid;

  const oldPrice = selectedProduct
    ? Math.round(selectedProduct.price * OLD_PRICE_MULT)
    : 0;
  const discountPct =
    selectedProduct && oldPrice > 0
      ? Math.round((1 - selectedProduct.price / oldPrice) * 100)
      : 0;

  function handlePay2() {
    console.log("pay", {
      gameId: selectedGameId,
      productId: selectedProductId,
      fields,
      promo,
    });
  }

  async function handlePay() {
    try {
      const valueOf = (type: Credential["type"]) =>
        fields[credentials.find((c) => c.type === type)?.id ?? -1]?.trim();

      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct?.id,
          clientId: valueOf("CLIENT_ID") ?? "",
          serverId: valueOf("SERVER_ID") || undefined,
          promo: promo.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.redirectUrl) {
        toast.danger({ title: data?.error || "Не удалось создать платёж" });
        return;
      }
      window.location.href = data.redirectUrl;
    } catch (error) {
      toast.danger({ title: "Ошибка при создании заказа" });
    }
  }
  // Плейсхолдер для блока credentials в зависимости от статуса
  const credPlaceholder =
    credentialsStatus === "loading"
      ? "Загрузка..."
      : credentialsStatus === "error"
        ? "Ошибка загрузки"
        : !selectedProduct
          ? "Выберите пакет"
          : "Данные не требуются";

  return (
    <section className="overflow-hidden rounded-2xl border border-card-border bg-surface">
      {/* Шапка блока */}
      <div className="flex flex-col gap-1 border-b border-card-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent-soft text-accent">
            <Zap className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-semibold sm:text-xl">
            Быстрое пополнение
          </h2>
        </div>
        <p className="text-xs text-muted sm:text-sm">
          Без регистрации · оплата через СБП
        </p>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        {/* Шаг 1 — игра */}
        <div className="flex flex-col gap-2.5">
          <StepLabel n={1}>Игра</StepLabel>
          <div className="fade-x -mx-5 flex gap-2 overflow-x-auto px-5 scrollbar-none sm:-mx-6 sm:px-6">
            {games.map((game) => {
              const active = selectedGameId === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border pl-1.5 pr-3 text-sm font-medium transition-colors",
                    active
                      ? "border-accent bg-accent-soft text-foreground"
                      : "border-card-border bg-surface-2 text-muted hover:border-card-border-strong hover:text-foreground",
                  )}
                >
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-surface-3">
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
                  {game.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Шаги 2–3 + оплата */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_200px_auto] lg:items-end">
          <div className="flex min-w-0 flex-col gap-2.5">
            <StepLabel n={2}>Пакет</StepLabel>
            <Select
              value={selectedProductId ?? ""}
              onValueChange={setSelectedProductId}
              variant="filled"
              size="lg"
              placeholder={
                productsStatus === "loading" ? "Загрузка..." : "Выберите пакет"
              }
            >
              {products.map((p) => (
                <Option key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/coins/${selectedGame?.slug}.webp`}
                      alt=""
                      width={16}
                      height={16}
                      className="size-4 shrink-0"
                    />
                    <span className="num">
                      Кейс {p.title} {p.suffix} — {p.price} ₽
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5">
            <StepLabel n={3}>Данные аккаунта</StepLabel>
            <div className="flex flex-col gap-2 sm:flex-row">
              {credentialsStatus === "success" && credentials.length > 0 ? (
                credentials.map((c) => (
                  <Input
                    key={c.id}
                    variant="filled"
                    inputSize="lg"
                    value={fields[c.id] ?? ""}
                    onChange={(e) =>
                      setFields((f) => ({ ...f, [c.id]: e.target.value }))
                    }
                    placeholder={c.label}
                    aria-label={c.label}
                    className="min-w-0 flex-1"
                  />
                ))
              ) : (
                <Input
                  variant="filled"
                  inputSize="lg"
                  disabled
                  placeholder={credPlaceholder}
                  className="flex-1"
                />
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5">
            <span className="text-xs font-semibold text-muted">
              Промокод{" "}
              <span className="font-normal text-subtle">· необязательно</span>
            </span>
            <PromoInput className="h-12" showErrorText={false} />
          </div>

          <Button
            onClick={handlePay}
            disabled={!canPay}
            size="lg"
            className="num w-full lg:w-auto lg:min-w-[180px]"
          >
            {selectedProduct
              ? `Оплатить ${selectedProduct.price} ₽`
              : "Оплатить"}
          </Button>
        </div>

        {/* Скидка + дисклеймер */}
        <div className="flex flex-col gap-2 border-t border-card-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          {discountPct > 0 && selectedProduct ? (
            <span className="flex items-center gap-2 text-xs text-muted">
              <Badge variant="discount" size="sm">
                −{discountPct}%
              </Badge>
              вместо <span className="num line-through">{oldPrice} ₽</span>
            </span>
          ) : (
            <span />
          )}
          <p className="text-xs text-subtle sm:text-right">
            Нажимая «Оплатить», вы принимаете{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-muted"
            >
              Правила конфиденциальности
            </a>{" "}
            и{" "}
            <a
              href="/eula"
              className="underline underline-offset-2 hover:text-muted"
            >
              Пользовательское соглашение
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-xs font-semibold text-muted">
      <span className="num grid h-5 w-5 place-items-center rounded-full border border-card-border-strong text-[10px] text-foreground">
        {n}
      </span>
      {children}
    </span>
  );
}

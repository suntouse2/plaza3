import Image from "next/image";
import Link from "next/link";
import { Card, Badge, cn } from "@/components/ui";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Receipt,
  CreditCard,
  MessageCircle,
  Package,
  ShieldCheck,
  Hash,
  CalendarClock,
  ChevronRight,
  FileText,
} from "lucide-react";
import { PlasmiteIcon } from "@/components/plasmite-icon";
import { OrderStatus } from "@/app/generated/prisma/client";
import { supportLink } from "@/data/shared";
import OrderRefresher from "@/components/order-refresher";
import Case from "@/components/case";

const OLD_PRICE_MULT = 1.54; // ~ -35%

type ProductSnapshot = {
  title?: string;
  amount?: number;
  suffix?: string;
  price?: number;
  imageUrl?: string | null;
  gameTitle?: string;
  data: {
    title: string;
  };
};

type CredentialEntry = {
  label?: string;
  value?: string;
  type?: string;
};

const STATUS_MAP: Record<
  OrderStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    accent: string;
    soft: string;
    desc: string;
    step: number; // 0..2 для прогресса
  }
> = {
  PENDING: {
    label: "Ожидает оплаты",
    icon: Clock,
    accent: "text-amber-400",
    soft: "bg-amber-400/10",
    desc: "Заказ создан и ожидает оплаты",
    step: 0,
  },
  PAID: {
    label: "Оплачен",
    icon: Package,
    accent: "text-sky-400",
    soft: "bg-sky-400/10",
    desc: "Оплата получена, отправляем товар на ваш аккаунт",
    step: 1,
  },
  COMPLETED: {
    label: "Выполнен",
    icon: CheckCircle2,
    accent: "text-emerald-400",
    soft: "bg-emerald-400/10",
    desc: "Заказ успешно доставлен",
    step: 2,
  },
  FAILED: {
    label: "Ошибка",
    icon: XCircle,
    accent: "text-red-400",
    soft: "bg-red-400/10",
    desc: "При обработке заказа произошла ошибка",
    step: -1,
  },
};

const PAY_LABELS: Record<
  string,
  { label: string; icon: "plazmite" | "img"; src?: string }
> = {
  plazmite: { label: "Плазмитами", icon: "plazmite" },
  sbp: { label: "СБП", icon: "img", src: "/pay/sbp.svg" },
  card: { label: "Картой", icon: "img", src: "/pay/cards.png" },
};

const STEPS = [
  { label: "Создан", icon: Receipt },
  { label: "Оплата", icon: CreditCard },
  { label: "Доставлен", icon: Package },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function OrderPage({
  params,
}: PageProps<"/orders/[uuid]">) {
  const { uuid } = await params;

  const order = await prisma.order.findUnique({ where: { id: uuid } });

  if (!order) {
    return notFound();
  }

  const snapshot = (order.productSnapshot ?? {}) as ProductSnapshot;
  const credentials = (
    Array.isArray(order.credentials) ? order.credentials : []
  ) as CredentialEntry[];

  const status = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING;
  const StatusIcon = status.icon;
  const pay = PAY_LABELS[order.paymentMethod] ?? {
    label: order.paymentMethod,
    icon: "img" as const,
  };

  const price = snapshot.price ?? 0;
  const oldPrice = Math.round(price * OLD_PRICE_MULT);
  const discount = oldPrice - price;
  const discountPct =
    oldPrice > 0 ? Math.round((1 - price / oldPrice) * 100) : 0;
  const isFailed = order.status === OrderStatus.FAILED;
  const inProgress =
    order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID;

  const isPaid =
    order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED;

  return (
    <div className="mx-auto w-full max-w-5xl py-2">
      {inProgress && <OrderRefresher />}
      {/* Назад */}
      <Link
        href="/"
        className="mb-4 flex w-max items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        На главную
      </Link>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Статус заказа
          </span>
          <h1 className="flex flex-wrap items-center gap-x-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Заказ
            <span className="font-mono text-accent-text">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </h1>
        </div>

        <Badge
          variant="default"
          size="sm"
          className={cn("gap-1.5", status.soft, status.accent)}
        >
          <StatusIcon
            className={cn(
              "h-3.5 w-3.5",
              order.status === OrderStatus.PENDING && "animate-pulse",
            )}
          />
          {status.label}
        </Badge>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {isPaid &&
            snapshot.price &&
            snapshot.price > 100 &&
            snapshot.imageUrl && (
              <Case
                title={snapshot.data.title + " " + snapshot.suffix}
                imageUrl={snapshot.imageUrl}
              />
            )}

          {/* Шапка статуса */}
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                    status.soft,
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "h-7 w-7",
                      status.accent,
                      order.status === OrderStatus.PENDING && "animate-pulse",
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground">
                    {status.label}
                  </h1>
                  <p className="text-sm text-muted">{status.desc}</p>
                </div>
              </div>

              {order.status === OrderStatus.PENDING && order.paymentUrl && (
                <Link
                  href={order.paymentUrl}
                  className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-accent-fg transition-opacity hover:opacity-90"
                >
                  <CreditCard className="h-4 w-4" />
                  Оплатить
                </Link>
              )}
            </div>

            {/* Прогресс-степпер */}
            {!isFailed && (
              <div className="flex items-center gap-1">
                {STEPS.map((s, i) => {
                  const done = i <= status.step;
                  const StepIcon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex flex-1 items-center gap-1"
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                            done
                              ? "bg-accent-soft text-accent-text"
                              : "bg-card-filled text-subtle",
                          )}
                        >
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            done ? "text-foreground" : "text-subtle",
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            "mb-5 h-0.5 flex-1 rounded-full transition-colors",
                            i < status.step ? "bg-accent" : "bg-card-border",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Номер заказа */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card-filled px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-subtle" />
                <span className="text-muted">Заказ</span>
                <span className="font-mono font-semibold text-foreground">
                  {order.id}
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-subtle">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDate(order.createdAt)}
              </span>
            </div>
          </Card>

          {/* Товар */}
          <Card className="relative flex flex-col gap-4 overflow-hidden p-5 sm:p-6">
            {snapshot.imageUrl && (
              <div className="pointer-events-none absolute -right-8 -bottom-8 z-0 h-44 w-44 opacity-10 blur-2xl">
                <Image src={snapshot.imageUrl} alt="" fill sizes="176px" />
              </div>
            )}

            <h2 className="relative z-1 text-sm font-bold uppercase tracking-wider text-subtle">
              Товар
            </h2>

            <div className="relative z-1 flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-card-filled-border">
                {snapshot.imageUrl ? (
                  <Image
                    src={snapshot.imageUrl}
                    alt={snapshot.title ?? ""}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-extrabold text-accent-text/40">
                    {snapshot.suffix ?? "?"}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {snapshot.gameTitle && (
                  <p className="truncate text-xs text-muted">
                    {snapshot.gameTitle}
                  </p>
                )}
                <h3 className="truncate text-base font-bold text-foreground">
                  {snapshot.data.title + " " + snapshot.suffix}
                </h3>
                {discountPct > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="discount" size="sm">
                      −{discountPct}%
                    </Badge>
                    <span className="text-xs text-white/50 line-through">
                      {oldPrice.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xl font-extrabold text-foreground">
                  {price.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>
          </Card>

          {/* Данные для доставки */}
          {credentials.length > 0 && (
            <Card className="flex flex-col gap-4 p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-subtle">
                Данные для доставки
              </h2>
              <div className="flex flex-col gap-2">
                {credentials.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl bg-card-filled px-4 py-3"
                  >
                    <span className="shrink-0 text-sm text-muted">
                      {c.label}
                    </span>
                    <span className="truncate text-sm font-semibold text-foreground">
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Оплата */}
          <Card className="flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-subtle">
              Оплата
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Способ оплаты</span>
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  {pay.icon === "plazmite" ? (
                    <PlasmiteIcon className="h-4 w-4" />
                  ) : (
                    pay.src && (
                      <Image
                        src={pay.src}
                        alt={pay.label}
                        width={28}
                        height={28}
                      />
                    )
                  )}
                  {pay.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted">Цена</span>
                <span className="text-muted line-through">
                  {oldPrice ? `${oldPrice.toLocaleString("ru-RU")} ₽` : "—"}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted">Выгода</span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      −{discount.toLocaleString("ru-RU")} ₽
                    </span>
                    {discountPct > 0 && (
                      <Badge variant="discount" size="sm">
                        −{discountPct}%
                      </Badge>
                    )}
                  </span>
                </div>
              )}

              {order.paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted">ID платежа</span>
                  <span className="font-mono text-xs font-medium text-foreground">
                    {order.paymentId}
                  </span>
                </div>
              )}

              <div className="my-1 h-px bg-card-border" />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">
                  Итого
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  {price.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[300px]">
          {/* Гарантия / доставка */}
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Безопасная сделка
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Среднее время доставки —{" "}
              <span className="font-semibold text-foreground">2 минуты</span>.
              При проблемах с заказом мы вернём средства.
            </p>
          </Card>
          <Link href={"/eula"} target="_blank">
            <Card
              variant="interactive"
              className="group flex items-center gap-3 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">
                  Пользовательское соглашение
                </p>
                <p className="truncate text-xs text-muted">Условия сервиса</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
            </Card>
          </Link>
          {/* Поддержка */}
          <Link href={supportLink} target="_blank">
            <Card
              variant="interactive"
              className="group flex items-center gap-3 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">Поддержка</p>
                <p className="truncate text-xs text-muted">Поможем с заказом</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

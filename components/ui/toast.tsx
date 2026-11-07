"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Alert } from "./alert";

type Variant = "info" | "success" | "warning" | "danger";

/** Дефолтная иконка под каждый вариант (можно переопределить) */
const defaultIcons: Record<Variant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

/* ============ Toaster — вставь один раз в layout ============ */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      // отключаем дефолтное оформление sonner — рисуем свой Alert
      toastOptions={{ unstyled: true, classNames: { toast: "w-full" } }}
      gap={8}
      offset={16}
    />
  );
}

/* ============ Обёртка над toast ============ */

type ToastOptions = {
  title?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  /** длительность в мс (по умолчанию sonner ~4000) */
  duration?: number;
};

function show(variant: Variant, opts: ToastOptions) {
  const Icon = opts.icon ?? defaultIcons[variant];
  return sonnerToast.custom(
    () => (
      <Alert
        variant={variant}
        icon={Icon}
        title={opts.title}
        className="w-full shadow-2xl shadow-black/40"
      >
        {opts.description}
      </Alert>
    ),
    { duration: opts.duration }
  );
}

/** toast.success({ title, description }) и т.д. */
export const toast = {
  info: (opts: ToastOptions) => show("info", opts),
  success: (opts: ToastOptions) => show("success", opts),
  warning: (opts: ToastOptions) => show("warning", opts),
  danger: (opts: ToastOptions) => show("danger", opts),
  /** ручной вызов с любым вариантом */
  show,
  /** прямой доступ к sonner, если нужно (loading/promise/dismiss) */
  raw: sonnerToast,
};

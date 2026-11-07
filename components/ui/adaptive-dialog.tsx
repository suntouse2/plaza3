"use client";

import { Drawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "./cn";
import { Dialog, DialogContent, type DialogContentProps } from "./dialog";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
} & Pick<
  DialogContentProps,
  "size" | "showClose" | "dismissable" | "className"
>;

/**
 * Десктоп → центрированный Dialog.
 * Мобилка → выезжающая снизу шторка (vaul) с тем же контентом.
 * API одинаковый: open / onOpenChange / children.
 */
export function AdaptiveDialog({
  open,
  onOpenChange,
  children,
  size = "md",
  showClose = true,
  dismissable = true,
  className,
}: Props) {
  const isMobile = useIsMobile();

  // До монтирования (isMobile === undefined) рендерим десктоп-вариант,
  // чтобы не мигало; на клиенте быстро скорректируется.
  if (isMobile) {
    return (
      <Drawer.Root
        open={open}
        onOpenChange={onOpenChange}
        dismissible={dismissable}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Drawer.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl border-t border-card-border bg-surface text-foreground outline-none",
              className
            )}
          >
            {/* Ручка-хваталка */}
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-card-border-strong" />

            <div className="relative overflow-y-auto px-4 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
              {showClose && (
                <button
                  onClick={() => onOpenChange(false)}
                  aria-label="Закрыть"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {children}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // Десктоп
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size={size}
        showClose={showClose}
        dismissable={dismissable}
        className={className}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

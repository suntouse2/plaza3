"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "./cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: Size;
  showClose?: boolean;
  dismissable?: boolean;
}

export function DialogContent({
  size = "md",
  showClose = true,
  dismissable = true,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px]" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          onInteractOutside={(e) => {
            if (!dismissable) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissable) e.preventDefault();
          }}
          className={cn(
            "dialog-content scrollbar-thin relative max-h-[calc(100dvh-32px)] w-full overflow-y-auto rounded-2xl border border-card-border bg-surface p-6 text-foreground shadow-2xl shadow-black/60",
            sizes[size],
            className
          )}
          {...props}
        >
          {children}

          {showClose && (
            <DialogPrimitive.Close
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-5 flex flex-col gap-1.5 pr-10", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />
  );
}

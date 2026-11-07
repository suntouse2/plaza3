"use client";

import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Viewport,
  Item,
  ItemText,
  ItemIndicator,
  type SelectProps as RadixSelectProps,
} from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "./cn";
import type { ReactNode } from "react";

type Variant = "default" | "filled";
type Size = "sm" | "md" | "lg";

const triggerVariants: Record<Variant, string> = {
  default:
    "border border-card-border bg-background hover:border-card-border-strong",
  filled:
    "border border-card-border bg-surface-2 hover:border-card-border-strong",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-3.5 text-sm",
  lg: "h-12 px-4 text-[15px]",
};

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Выберите...",
  variant = "default",
  size = "md",
  className,
  disabled,
  children,
}: SelectProps) {
  return (
    <Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Trigger
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg text-left text-foreground outline-none transition-colors data-[state=open]:border-accent-border focus-visible:ring-2 focus-visible:ring-accent-ring disabled:cursor-not-allowed disabled:opacity-60 data-[placeholder]:text-subtle",
          triggerVariants[variant],
          sizes[size],
          className
        )}
      >
        <span className="truncate">
          <Value placeholder={placeholder} />
        </span>
        <Icon asChild>
          <ChevronDown className="h-4 w-4 shrink-0 text-subtle" />
        </Icon>
      </Trigger>

      <Portal>
        <Content
          position="popper"
          sideOffset={8}
          className="z-120 max-h-72 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-card-border bg-surface-2 p-1 shadow-2xl shadow-black/60"
        >
          <Viewport className="scrollbar-thin max-h-72 overflow-y-auto">{children}</Viewport>
        </Content>
      </Portal>
    </Root>
  );
}

export interface OptionProps {
  value: string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

export function Option({ value, className, children, disabled }: OptionProps) {
  return (
    <Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex min-h-10 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-muted outline-none transition-colors",
        "data-highlighted:bg-surface-3 data-highlighted:text-foreground",
        "data-[state=checked]:text-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        className
      )}
    >
      <ItemText>{children}</ItemText>
      <ItemIndicator>
        <Check className="h-4 w-4 shrink-0 text-accent" />
      </ItemIndicator>
    </Item>
  );
}

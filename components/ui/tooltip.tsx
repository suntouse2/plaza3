// components/ui/tooltip.tsx
"use client";

import {
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
} from "@radix-ui/react-tooltip";
import { cn } from "./cn";
import type { ReactNode } from "react";

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 200,
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delay?: number;
  className?: string;
}) {
  return (
    <Provider delayDuration={delay}>
      <Root>
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            side={side}
            align={align}
            sideOffset={8}
            collisionPadding={12}
            className={cn(
              "z-[120] max-w-xs rounded-lg border border-card-border-strong bg-surface-3 px-3 py-2 text-xs leading-relaxed text-foreground shadow-2xl shadow-black/60",
              "data-[state=delayed-open]:animate-[fade-in_0.12s_ease-out]",
              "data-[side=top]:data-[state=delayed-open]:slide-in-from-bottom-1",
              className
            )}
          >
            {content}
            <Arrow className="fill-surface-3" width={11} height={6} />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}

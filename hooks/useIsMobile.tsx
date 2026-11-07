"use client";

import { useEffect, useState } from "react";

/** true, если ширина экрана меньше breakpoint (по умолчанию 768px = md) */
export function useIsMobile(breakpoint = 768) {
  // undefined на первом рендере — чтобы не мигало до монтирования
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

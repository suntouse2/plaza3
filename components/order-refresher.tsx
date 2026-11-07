"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Перезапрашивает страницу заказа, пока он не завершится */
export default function OrderRefresher({ interval = 10_000 }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), interval);
    return () => clearInterval(id);
  }, [router, interval]);

  return null;
}

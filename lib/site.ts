/**
 * Глобальные настройки сайта для SEO: домен, бренд, общие тексты.
 * Домен задаётся через NEXT_PUBLIC_SITE_URL (без слеша на конце) —
 * от него строятся canonical, sitemap, robots и Open Graph.
 */
import { siteUrl } from "@/data/shared";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? siteUrl
).replace(/\/+$/, "");

export const SITE_NAME = "GamerPlaza";

export const SITE_TITLE =
  "GamerPlaza — пополнение игр и донат дешево: UC, алмазы, кристаллы";

export const SITE_DESCRIPTION =
  "GamerPlaza — магазин доната в мобильные и ПК игры: UC в PUBG Mobile, алмазы Mobile Legends и Free Fire, кристаллы Genshin Impact, VP Valorant. Пополнение по ID за 2 минуты, оплата СБП из России.";

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Сериализация JSON-LD без XSS: `<` экранируется (рекомендация Next.js) */
export const jsonLd = (data: unknown) => ({
  __html: JSON.stringify(data).replace(/</g, "\\u003c"),
});

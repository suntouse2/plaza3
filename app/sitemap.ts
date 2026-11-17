import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site";

/** Карта сайта для Яндекса и Google: главная, игры, товары, документы */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      productCategories: { select: { products: { select: { id: true } } } },
    },
    orderBy: { title: "asc" },
  });

  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    ...games.flatMap((g) => [
      {
        url: absoluteUrl(`/game/${g.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      ...g.productCategories.flatMap((c) =>
        c.products.map((p) => ({
          url: absoluteUrl(`/products/${p.id}`),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        })),
      ),
    ]),
    ...["/eula", "/privacy", "/refund"].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { ArrowLeftIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import Receipt from "@/components/receipt";
import { getGameSeo } from "@/data/seo";
import { absoluteUrl, jsonLd, SITE_NAME } from "@/lib/site";

// cache — один запрос к БД на generateMetadata + страницу
const getProduct = cache((id: string) =>
  prisma.gameProduct.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          game: true,
          credentials: { orderBy: { id: "asc" } },
        },
      },
    },
  }),
);

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product || !product.category.game.isActive) return {};
  const game = product.category.game;
  const seo = getGameSeo(game.slug, game.title);
  const name = `${product.title} ${product.suffix}`;
  const price = Math.round(product.price).toLocaleString("ru-RU");
  const path = `/products/${product.id}`;
  const title = `Купить ${name} ${game.title} за ${price} ₽ | ${SITE_NAME}`;
  const description = `Купить ${name} в ${game.title} за ${price} ₽ по ${seo.idName} — без пароля и входа в аккаунт. Зачисление в среднем за 2 минуты, оплата через СБП из России.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title,
      description,
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: `${name} ${game.title}` }]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product || !product.category.game.isActive) notFound();

  const { category, ...rest } = product;
  const { game, credentials } = category;

  const name = `${rest.title} ${rest.suffix}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Игры", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: game.title,
            item: absoluteUrl(`/game/${game.slug}`),
          },
          { "@type": "ListItem", position: 3, name },
        ],
      },
      {
        "@type": "Product",
        name: `${name} ${game.title}`,
        image: rest.imageUrl ? absoluteUrl(rest.imageUrl) : undefined,
        brand: { "@type": "Brand", name: game.title },
        offers: {
          "@type": "Offer",
          price: rest.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/products/${rest.id}`),
          seller: { "@type": "Organization", name: SITE_NAME },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />
      <Link
        href={`/game/${game.slug}`}
        className="flex w-max items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Все товары {game.title}
      </Link>
      <Receipt
        product={rest}
        game={game}
        categoryTitle={category.title}
        credentials={credentials}
      />
    </div>
  );
}

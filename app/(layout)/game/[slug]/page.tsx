import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";
import ProductsList from "@/components/products-list";
import {
  faqJsonLd,
  SeoAdvantages,
  SeoFaq,
  SeoSection,
  SeoSteps,
} from "@/components/seo/seo-content";
import { buildFaq, getGameSeo } from "@/data/seo";
import { absoluteUrl, jsonLd, SITE_NAME } from "@/lib/site";

export async function generateStaticParams() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return games.map((game) => ({ slug: game.slug }));
}

// cache — один запрос к БД на generateMetadata + страницу
const getGame = cache((slug: string) =>
  prisma.game.findUnique({
    where: { slug },
    include: {
      productCategories: {
        include: { products: { orderBy: { price: "asc" } } },
        orderBy: { createdAt: "asc" },
      },
    },
  }),
);

export async function generateMetadata({
  params,
}: PageProps<"/game/[slug]">): Promise<Metadata> {
  const game = await getGame((await params).slug);
  if (!game || !game.isActive) return {};
  const seo = getGameSeo(game.slug, game.title);
  const path = `/game/${game.slug}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: seo.title,
      description: seo.description,
      images: [{ url: game.bannerUrl, alt: game.title }],
    },
  };
}

export default async function GamePage({ params }: PageProps<"/game/[slug]">) {
  const { slug } = await params;

  const game = await getGame(slug);

  if (!game || !game.isActive) notFound();

  const seo = getGameSeo(game.slug, game.title);
  const faq = buildFaq(game.title, seo);
  const prices = game.productCategories.flatMap((c) =>
    c.products.map((p) => p.price),
  );
  const url = absoluteUrl(`/game/${game.slug}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Игры", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: seo.h1, item: url },
        ],
      },
      ...(prices.length
        ? [
            {
              "@type": "Product",
              name: seo.h1,
              description: seo.description,
              image: absoluteUrl(game.bannerUrl),
              brand: { "@type": "Brand", name: game.title },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "RUB",
                lowPrice: Math.min(...prices),
                highPrice: Math.max(...prices),
                offerCount: prices.length,
                availability: "https://schema.org/InStock",
                url,
                seller: { "@type": "Organization", name: SITE_NAME },
              },
            },
          ]
        : []),
      faqJsonLd(faq),
    ],
  };

  return (
    <div className="flex flex-col gap-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />

      <ProductsList
        game={game}
        heading={seo.h1}
        categories={game.productCategories}
      />

      <div className="flex flex-col gap-8">
        <SeoSection title={`Купить ${seo.currencyBuy} в ${game.title} дешево`}>
          {seo.about.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </SeoSection>

        <SeoSection title={`Как пополнить ${game.title}`}>
          <SeoSteps
            steps={[
              "Выберите пакет валюты в карточках выше.",
              `Укажите ${seo.idName} — пароль не нужен.`,
              "Оплатите заказ через СБП.",
              `Получите ${seo.currency} на аккаунт в среднем за 2 минуты.`,
            ]}
          />
        </SeoSection>

        <SeoAdvantages title={`Почему стоит пополнять ${game.title} в ${SITE_NAME}`} />

        <SeoFaq label={`Вопросы и ответы о донате в ${game.title}`} items={faq} />
      </div>
    </div>
  );
}

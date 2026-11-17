import type { Metadata } from "next";
import FastReceipt from "@/components/fast-receipt";
import GameGrid from "@/components/games-grid";
import PlasmitePromo from "@/components/plasmite-promo";
import Promo from "@/components/promo";
import TrustStrip from "@/components/trust-strip";
import {
  faqJsonLd,
  SeoAdvantages,
  SeoFaq,
  SeoSection,
  SeoSteps,
} from "@/components/seo/seo-content";
import { HOME_FAQ } from "@/data/seo";
import { canPurchase } from "@/data/shared";
import prisma from "@/lib/prisma";
import { absoluteUrl, jsonLd, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function Page() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: [{ isPopular: "desc" }, { title: "asc" }],
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteUrl("/"),
        inLanguage: "ru-RU",
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.png"),
      },
      {
        "@type": "ItemList",
        name: "Игры для пополнения",
        itemListElement: games.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.title,
          url: absoluteUrl(`/game/${g.slug}`),
        })),
      },
      faqJsonLd(HOME_FAQ),
    ],
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />

      <div className="flex flex-col gap-4">
        <Promo />
        <TrustStrip />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold sm:text-[28px]">
          Пополнение игр и донат онлайн
        </h1>
        <p className="max-w-3xl text-sm text-muted">
          UC в PUBG Mobile, алмазы Mobile Legends и Free Fire, кристаллы Genshin
          Impact, VP в Valorant и другие игровые валюты — по игровому ID, без
          пароля, с оплатой через СБП из России.
        </p>
      </div>

      <FastReceipt games={games.filter((g) => canPurchase(g.slug))} />

      <GameGrid games={games} />

      <PlasmitePromo />

      <div className="flex flex-col gap-8">
        <SeoSection title="Донат в игры из России без VPN и зарубежных карт">
          <p>
            {SITE_NAME} — сервис пополнения игровой валюты для мобильных и ПК
            игр. Мы зачисляем валюту напрямую на ваш аккаунт по игровому ID: не
            нужно передавать логин и пароль, привязывать карту к игре или
            искать обходные способы оплаты.
          </p>
          <p>
            Оплачивайте заказы в рублях через СБП — заказ выполняется
            автоматически, в среднем за 2 минуты. Работаем круглосуточно, а
            поддержка в Telegram поможет с любым вопросом.
          </p>
        </SeoSection>

        <SeoSection title="Как пополнить игру">
          <SeoSteps
            steps={[
              "Выберите игру из каталога.",
              "Выберите пакет валюты и укажите игровой ID.",
              "Оплатите заказ через СБП.",
              "Валюта поступит на аккаунт в среднем за 2 минуты.",
            ]}
          />
        </SeoSection>

        <SeoAdvantages title={`Почему выбирают ${SITE_NAME}`} />

        <SeoFaq label="Вопросы и ответы" items={HOME_FAQ} />
      </div>
    </div>
  );
}

export type Promo = {
  id: string;
  href: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  gameSlug: string;
};

export const promos: Promo[] = [
  {
    id: "pubgm-haki",
    href: "/game/pubg-mobile",
    badge: "Доступно сейчас",
    title: "Рулетка «Honor»",
    description:
      "Новая рулетка «Honor» уже в игре, до 70% бонуса на покупку в PUBG Mobile",
    image: "/promo/pubg.webp",
    cta: "Купить UC",
    gameSlug: "pubg-mobile",
  },
  {
    id: "genshin",
    href: "/game/genshin",
    badge: "Новый баннер",
    title: "Genshin Impact",
    description: "Кристаллы судьбы со скидкой и мгновенным зачислением",
    image: "/promo/genshin.webp",
    cta: "Купить кристаллы",
    gameSlug: "genshin",
  },
  {
    id: "mlbb",
    href: "/game/mobile-legends",
    badge: "MOBILE LEGENDS",
    title: "Неозвери уже в охоте!",
    description: "Алмазы по лучшей цене — пополнение за 1 минуту",
    image: "/promo/mlbb.jpg",
    cta: "Пополнить алмазы",
    gameSlug: "mobile-legends",
  },
  {
    id: "brawl",
    href: "/game/brawl-stars",
    badge: "Популярное",
    title: "Brawl Stars",
    description: "Новый боец уже в игре",
    image: "/promo/brawl.webp",
    cta: "Купить гемы",
    gameSlug: "brawl-stars",
  },
];

import {
  CredentialType,
  GamePlatform,
  GameType,
} from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import seed from "./seed.json";

/* ================================================================== */
/*  ДАННЫЕ — редактируешь только это                                  */
/* ================================================================== */

type Game = {
  slug: string;
  title: string;
  description: string;
  bannerUrl: string;
  type: GameType;
  platform?: GamePlatform; // по умолчанию MOBILE
  popular?: boolean;
  new?: boolean;
  categories: Category[];
};

type Category = {
  title: string;
  fields: Field[];
  /** валюта пакета: суффикс после числа (UC, Алмазов, Кристаллов...) */
  currency: string;
  products: Product[];
};

type Product = {
  amount: number;
  price: number;
  imageUrl: string;
  /** данные для выдачи у поставщика (product_id и т.д.) */
  data?: object;
};

/** Товары из seed.json (формат gamerdrop) по slug игры */
const seedProducts = (slug: string): Product[] =>
  seed.products
    .filter((p) => p.category === slug)
    .map((p) => ({
      amount: parseInt(p.title),
      price: p.price,
      imageUrl: p.imageSrc,
      data: p.data,
    }));

type Field =
  | "uid" // игровой ID / UID / Player ID / Hunter No.
  | "server" // ID сервера / Zone ID
  | "login" // логин / Riot ID
  | "password"
  | "email" // email от аккаунта
  | "nickname"; // имя в игре

const GAMES: Game[] = [
  {
    slug: "pubg-mobile",
    title: "PUBG Mobile",
    description:
      "Порази своих тимейтов крутыми скинами или прокатись на новой машине благодаря официальной покупке UC и доната в PUBG Mobile.",
    bannerUrl: "/games/pubg-mobile/banner.webp",
    type: GameType.SHOOTER,

    popular: true,
    categories: [
      {
        title: "UC",
        fields: ["uid"],
        currency: "UC",
        products: seedProducts("pubg-mobile"),
      },
    ],
  },
  {
    slug: "mobile-legends",
    title: "Mobile Legends",
    description:
      "Пополняй алмазы в Mobile Legends моментально — просто введи свой ID. Боевые пропуска доступны мгновенно.",
    bannerUrl: "/games/mobile-legends/banner.webp",
    type: GameType.MOBS,
    popular: true,
    categories: [
      {
        title: "Алмазы",
        fields: ["uid", "server"],
        currency: "Алмазов",
        products: seedProducts("mobile-legends"),
      },
    ],
  },
  {
    slug: "free-fire",
    title: "Free Fire",
    description:
      "Прокачайся в Free Fire за секунды — получи алмазы мгновенно и отправься в бой с питомцем или новым скином.",
    bannerUrl: "/games/free-fire/banner.webp",
    type: GameType.SHOOTER,
    popular: true,
    categories: [
      {
        title: "Алмазы",
        fields: ["uid"],
        currency: "Алмазов",
        products: [
          { amount: 110, price: 70, imageUrl: "/games/free-fire/1.webp" },
          { amount: 341, price: 226, imageUrl: "/games/free-fire/2.webp" },
          { amount: 572, price: 367, imageUrl: "/games/free-fire/3.webp" },
          { amount: 1166, price: 739, imageUrl: "/games/free-fire/4.webp" },
        ],
      },
    ],
  },
  {
    slug: "genshin-impact",
    title: "Genshin Impact",
    description:
      "Усиль свою команду! Кристаллы Genshin Impact доступны для моментальной покупки по UID — быстрая доставка, честные цены.",
    bannerUrl: "/games/genshin-impact/banner.webp",
    type: GameType.GACHA,
    popular: true,
    categories: [
      {
        title: "Кристаллы",
        fields: ["uid"],
        currency: "Кристаллов",
        products: [
          { amount: 60, price: 94, imageUrl: "/games/genshin-impact/1.webp" },
          {
            amount: 330,
            price: 426,
            imageUrl: "/games/genshin-impact/2.webp",
          },
          {
            amount: 1090,
            price: 1320,
            imageUrl: "/games/genshin-impact/3.webp",
          },
          {
            amount: 2240,
            price: 2650,
            imageUrl: "/games/genshin-impact/4.webp",
          },
          {
            amount: 3880,
            price: 4455,
            imageUrl: "/games/genshin-impact/5.webp",
          },
        ],
      },
    ],
  },
  {
    slug: "love-and-deepspace",
    title: "Love & Deepspace",
    description:
      "Дари чувства и лети к звёздам — кристаллы и пропуски в Love & Deepspace доступны мгновенно.",
    bannerUrl: "/games/love-and-deepspace/banner.webp",
    type: GameType.GACHA,
    popular: true,
    categories: [
      {
        title: "Кристаллы",
        fields: ["uid", "nickname"],
        currency: "Кристаллов",
        products: [
          {
            amount: 60,
            price: 75,
            imageUrl: "/games/love-and-deepspace/1.webp",
          },
          {
            amount: 1130,
            price: 1209,
            imageUrl: "/games/love-and-deepspace/2.webp",
          },
          {
            amount: 2340,
            price: 2379,
            imageUrl: "/games/love-and-deepspace/3.webp",
          },
          {
            amount: 4000,
            price: 3999,
            imageUrl: "/games/love-and-deepspace/4.webp",
          },
          {
            amount: 8080,
            price: 7759,
            imageUrl: "/games/love-and-deepspace/5.webp",
          },
        ],
      },
    ],
  },
  {
    slug: "fc-mobile",
    title: "FC Mobile",
    description:
      "Собери команду мечты в FC Mobile! Моментальная доставка напрямую на твой аккаунт.",
    bannerUrl: "/games/fc-mobile/banner.webp",
    type: GameType.OTHER,
    popular: true,
    categories: [
      {
        title: "FC Points",
        fields: ["email"],
        currency: "FC Points",
        products: [
          { amount: 100, price: 93, imageUrl: "/games/fc-mobile/1.webp" },
          { amount: 1070, price: 929, imageUrl: "/games/fc-mobile/2.webp" },
          { amount: 2200, price: 1849, imageUrl: "/games/fc-mobile/3.webp" },
          { amount: 5750, price: 4849, imageUrl: "/games/fc-mobile/4.webp" },
          { amount: 12000, price: 9239, imageUrl: "/games/fc-mobile/5.webp" },
        ],
      },
    ],
  },
  {
    slug: "zenless-zone-zero",
    title: "Zenless Zone Zero",
    description:
      "Монохромы и подписка Интернот — пополняй аккаунт моментально и продолжай взрывать стильный киберпанк.",
    bannerUrl: "/games/zenless-zone-zero/banner.webp",
    type: GameType.GACHA,
    popular: true,
    categories: [
      {
        title: "Монохромы",
        fields: ["uid"],
        currency: "монохромов",
        products: [
          {
            amount: 60,
            price: 94,
            imageUrl: "/games/zenless-zone-zero/1.webp",
          },
          {
            amount: 330,
            price: 426,
            imageUrl: "/games/zenless-zone-zero/2.webp",
          },
          {
            amount: 1090,
            price: 1320,
            imageUrl: "/games/zenless-zone-zero/3.webp",
          },
          {
            amount: 2240,
            price: 2650,
            imageUrl: "/games/zenless-zone-zero/4.webp",
          },
          {
            amount: 3880,
            price: 4455,
            imageUrl: "/games/zenless-zone-zero/5.webp",
          },
          {
            amount: 8080,
            price: 8540,
            imageUrl: "/games/zenless-zone-zero/6.webp",
          },
        ],
      },
    ],
  },
  {
    slug: "valorant",
    title: "Valorant",
    description:
      "Удиви всех в матче крутыми анимациями! Valorant Points по отличным ценам для российских аккаунтов.",
    bannerUrl: "/games/valorant/banner.webp",
    type: GameType.SHOOTER,
    platform: GamePlatform.DESKTOP,
    popular: true,
    categories: [
      {
        title: "VP Points",
        fields: ["login"], // Riot ID
        currency: "VP",
        products: [
          { amount: 240, price: 1499, imageUrl: "/games/valorant/1.webp" },
          { amount: 1000, price: 1599, imageUrl: "/games/valorant/2.webp" },
          { amount: 1520, price: 2299, imageUrl: "/games/valorant/3.webp" },
          { amount: 2575, price: 3199, imageUrl: "/games/valorant/4.webp" },
          { amount: 3620, price: 3999, imageUrl: "/games/valorant/5.webp" },
          { amount: 5351, price: 4999, imageUrl: "/games/valorant/6.webp" },
          { amount: 8705, price: 6999, imageUrl: "/games/valorant/7.webp" },
          { amount: 11000, price: 8999, imageUrl: "/games/valorant/8.webp" },
        ],
      },
    ],
  },
  {
    slug: "delta-force",
    title: "Delta Force",
    description:
      "Заряжайся на максимум и доминируй на поле боя — пополнение в Delta Force напрямую на аккаунт, быстро и выгодно.",
    bannerUrl: "/games/delta-force/banner.webp",
    type: GameType.SHOOTER,
    popular: true,
    categories: [
      {
        title: "Монеты",
        fields: ["uid"],
        currency: "монет",
        products: [
          { amount: 60, price: 179, imageUrl: "/games/delta-force/1.webp" },
          { amount: 750, price: 4999, imageUrl: "/games/delta-force/2.webp" },
          { amount: 1480, price: 6799, imageUrl: "/games/delta-force/3.webp" },
          { amount: 1980, price: 8999, imageUrl: "/games/delta-force/4.webp" },
          { amount: 3950, price: 13999, imageUrl: "/games/delta-force/5.webp" },
          { amount: 8100, price: 29999, imageUrl: "/games/delta-force/6.webp" },
          {
            amount: 24300,
            price: 35900,
            imageUrl: "/games/delta-force/7.webp",
          },
        ],
      },
    ],
  },
  {
    slug: "arena-breakout",
    title: "Arena Breakout",
    description:
      "Зарядись облигациями и выноси лут — выгодное пополнение на твой UID в Arena Breakout.",
    bannerUrl: "/games/arena-breakout/banner.webp",
    type: GameType.SHOOTER,
    popular: true,
    categories: [
      {
        title: "Облигации",
        fields: ["uid"],
        currency: "облигаций",
        products: [
          { amount: 66, price: 199, imageUrl: "/games/arena-breakout/1.webp" },
          {
            amount: 675,
            price: 5799,
            imageUrl: "/games/arena-breakout/2.webp",
          },
          {
            amount: 1690,
            price: 1799,
            imageUrl: "/games/arena-breakout/3.webp",
          },
          {
            amount: 3400,
            price: 2999,
            imageUrl: "/games/arena-breakout/4.webp",
          },
          {
            amount: 6820,
            price: 3999,
            imageUrl: "/games/arena-breakout/5.webp",
          },
        ],
      },
    ],
  },

  {
    slug: "honkai-star-rail",
    title: "Honkai: Star Rail",
    description:
      "Молниеносное пополнение Star Rail — сущности и пропуска поступают напрямую на твой UID.",
    bannerUrl: "/games/honkai-star-rail/banner.webp",
    type: GameType.GACHA,
    popular: true,
    categories: [
      {
        title: "Сущности",
        fields: ["uid"],
        currency: "сущностей",
        products: [
          { amount: 60, price: 69, imageUrl: "/games/honkai-star-rail/1.webp" },
          {
            amount: 800,
            price: 1099,
            imageUrl: "/games/honkai-star-rail/2.webp",
          },
          {
            amount: 1250,
            price: 1799,
            imageUrl: "/games/honkai-star-rail/3.webp",
          },
          {
            amount: 2320,
            price: 2999,
            imageUrl: "/games/honkai-star-rail/4.webp",
          },
          {
            amount: 3880,
            price: 3999,
            imageUrl: "/games/honkai-star-rail/5.webp",
          },
          {
            amount: 8599,
            price: 6999,
            imageUrl: "/games/honkai-star-rail/6.webp",
          },
        ],
      },
    ],
  },
];

/* ================================================================== */
/*  Ниже трогать не нужно                                             */
/* ================================================================== */

const FIELDS: Record<
  Field,
  { label: string; placeholder: string; regex: string; type: CredentialType }
> = {
  uid: {
    label: "Игровой ID",
    placeholder: "Введите ID",
    regex: "^[0-9]+$",
    type: CredentialType.CLIENT_ID,
  },
  server: {
    label: "ID сервера",
    placeholder: "Введите ID сервера",
    regex: "^[0-9]+$",
    type: CredentialType.SERVER_ID,
  },
  login: {
    label: "Riot ID / логин",
    placeholder: "Введите логин",
    regex: "^.+$",
    type: CredentialType.LOGIN,
  },
  password: {
    label: "Пароль",
    placeholder: "Введите пароль",
    regex: "^.+$",
    type: CredentialType.PASSWORD,
  },
  email: {
    label: "Email от аккаунта",
    placeholder: "example@mail.com",
    regex: "^\\S+@\\S+\\.\\S+$",
    type: CredentialType.EMAIL,
  },
  nickname: {
    label: "Имя в игре",
    placeholder: "Никнейм",
    regex: "^.+$",
    type: CredentialType.NICKNAME,
  },
};

async function main() {
  console.log("🌱  Seeding...");

  await prisma.gameProduct.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.gameProductCategory.deleteMany();
  await prisma.game.deleteMany();

  for (const g of GAMES) {
    await prisma.game.create({
      data: {
        slug: g.slug,
        title: g.title,
        description: g.description,
        bannerUrl: g.bannerUrl,
        type: g.type,
        platform: g.platform ?? GamePlatform.MOBILE,
        isPopular: g.popular ?? false,
        isNew: g.new ?? false,
        productCategories: {
          create: g.categories.map((c) => ({
            title: c.title,
            credentials: { create: c.fields.map((f) => FIELDS[f]) },
            products: {
              create: c.products.map((p) => ({
                title: String(p.amount),
                suffix: c.currency,
                imageUrl: p.imageUrl,
                amount: p.amount,
                price: p.price,
                data: p.data ?? {},
              })),
            },
          })),
        },
      },
    });

    console.log(`✅  ${g.title}`);
  }

  const total = GAMES.reduce(
    (n, g) => n + g.categories.reduce((m, c) => m + c.products.length, 0),
    0,
  );
  console.log(`🎉  Готово: ${GAMES.length} игр, ${total} товаров`);
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

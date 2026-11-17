export const supportLink = "https://t.me/donat_ss";
export const siteUrl = "https://iplaza.store";
/** Витринная скидка на все товары, % — от неё считается зачёркнутая цена */
export const productDiscount = 35;

/** Игры, которые сейчас можно купить. Остальные видны в каталоге, но оплата закрыта */
export const PURCHASABLE_GAMES = ["pubg-mobile", "mobile-legends"];
export const canPurchase = (gameSlug: string) =>
  PURCHASABLE_GAMES.includes(gameSlug);
export const PURCHASE_DISABLED_TEXT = "Покупка временно недоступна";

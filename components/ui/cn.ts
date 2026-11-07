/**
 * Утилита склейки классов. Пропускает falsy-значения,
 * последний дубликат не разруливает (для этого нужен tailwind-merge).
 * Если хочешь умное слияние — установи clsx + tailwind-merge и замени тело.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

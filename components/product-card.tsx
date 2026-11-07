import Image from "next/image";
import Link from "next/link";
import { GameProduct } from "@/app/generated/prisma/client";
import { Button } from "./ui";

type Props = {
  product: GameProduct;
  description?: string;
  discount?: number | null;
  hit?: boolean;
  /** первая строка сетки — грузим сразу, без lazy */
  eager?: boolean;
};

const formatPrice = (value: number) =>
  `${Math.round(value).toLocaleString("ru-RU")} ₽`;

export default function ProductCard({
  product,
  description,
  discount,
  hit,
  eager,
}: Props) {
  const oldPrice = discount ? product.price / (1 - discount / 100) : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col gap-3 rounded-3xl border border-card-border bg-card p-3 transition-colors outline-none hover:bg-card-hover focus-visible:ring-4 focus-visible:ring-accent-ring/25"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-2">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            loading={eager ? "eager" : undefined}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-accent-text/40">
            {product.suffix}
          </div>
        )}
        {hit && (
          <span className="absolute top-2 left-2 rounded-lg bg-accent px-2 py-1 text-xs font-semibold text-accent-fg">
            Хит продаж
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 rounded-lg bg-success-soft px-2 py-1 text-xs font-semibold text-success">
            −{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1">
        <h3 className="font-bold leading-tight">
          {product.amount.toLocaleString("ru-RU")} {product.suffix}
        </h3>
        {description && (
          <p className="line-clamp-2 text-xs text-muted">{description}</p>
        )}
      </div>

      <div className="num flex items-baseline gap-1.5 px-1">
        <span className="text-lg font-bold">{formatPrice(product.price)}</span>
        {oldPrice && (
          <span className="text-xs text-muted line-through">
            {formatPrice(oldPrice)}
          </span>
        )}
      </div>

      <Button asChild className="w-full group-hover:bg-accent-hover">
        <span>Купить</span>
      </Button>
    </Link>
  );
}

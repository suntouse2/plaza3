import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, BadgeCheck } from "lucide-react";
import {
  Game,
  GameProduct,
  GameProductCategory,
} from "@/app/generated/prisma/client";
import { Badge } from "./ui";
import ProductCard from "./product-card";
import { productDiscount } from "@/data/shared";

type Props = {
  game: Game;
  categories: (GameProductCategory & { products: GameProduct[] })[];
};

export default function ProductsList({ game, categories }: Props) {
  const filled = categories.filter((c) => c.products.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="flex w-max items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Вернуться на главную
      </Link>

      {/* game heading */}
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-card-border-strong sm:size-24">
          <Image
            src={game.bannerUrl}
            alt={game.title}
            fill
            sizes="96px"
            className="object-cover"
            preload
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {game.title}
            </h1>
            <Badge variant="success" size="md">
              <BadgeCheck className="h-3.5 w-3.5" /> Официально
            </Badge>
          </div>
          <p className="line-clamp-2 max-w-2xl text-sm text-muted">
            {game.description}
          </p>
        </div>
      </div>

      {filled.length === 0 ? (
        <p className="py-12 text-center text-muted">Товары скоро появятся</p>
      ) : (
        <div className="flex flex-col gap-8 pt-4">
          {filled.map((category, ci) => (
            <section key={category.id} className="flex flex-col gap-4">
              {filled.length > 1 && (
                <h2 className="text-lg font-bold">{category.title}</h2>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {category.products
                  .toSorted((a, b) => b.price - a.price)
                  .map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      description={`${game.title} · ${category.title}`}
                      discount={productDiscount}
                      hit={i === 0 || i === 1}
                      eager={ci === 0 && i < 10}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

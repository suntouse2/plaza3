import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import Receipt from "@/components/receipt";

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;

  const product = await prisma.gameProduct.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          game: true,
          credentials: { orderBy: { id: "asc" } },
        },
      },
    },
  });

  if (!product || !product.category.game.isActive) notFound();

  const { category, ...rest } = product;
  const { game, credentials } = category;

  return (
    <div className="flex flex-col gap-6">
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

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductsList from "@/components/products-list";

export async function generateStaticParams() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return games.map((game) => ({ slug: game.slug }));
}

export default async function GamePage({ params }: PageProps<"/game/[slug]">) {
  const { slug } = await params;

  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      productCategories: {
        include: { products: { orderBy: { price: "asc" } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!game || !game.isActive) notFound();

  return <ProductsList game={game} categories={game.productCategories} />;
}

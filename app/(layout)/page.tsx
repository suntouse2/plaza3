import FastReceipt from "@/components/fast-receipt";
import GameGrid from "@/components/games-grid";
import PlasmitePromo from "@/components/plasmite-promo";
import Promo from "@/components/promo";
import TrustStrip from "@/components/trust-strip";
import prisma from "@/lib/prisma";

export default async function Page() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: [{ isPopular: "desc" }, { title: "asc" }],
  });

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div className="flex flex-col gap-4">
        <Promo />
        <TrustStrip />
      </div>

      <FastReceipt games={games} />

      <GameGrid games={games} />

      <PlasmitePromo />
    </div>
  );
}

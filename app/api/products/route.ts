import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  const gameId = req.nextUrl.searchParams.get("gameId");
  if (!gameId)
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 });

  const products = await prisma.gameProduct.findMany({
    where: { category: { gameId: gameId } },
  });
  return NextResponse.json(products);
};

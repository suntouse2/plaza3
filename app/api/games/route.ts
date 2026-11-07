import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: [{ isPopular: "desc" }, { title: "asc" }],
  });
  return NextResponse.json(games);
};

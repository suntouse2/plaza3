import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: RouteContext<"/api/products/[id]/credentials">
) => {
  const { id } = await context.params;
  const product = await prisma.gameProduct.findUnique({ where: { id } });
  const category = await prisma.gameProductCategory.findUnique({
    where: { id: product?.categoryId },
    include: { credentials: true },
  });
  if (!category)
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json(category.credentials);
};

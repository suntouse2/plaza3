import prisma from "@/lib/prisma";
import { completeTopup, fulfillOrder } from "@/lib/fulfillment";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const requestSchema = z.object({
  shopOrderId: z.string(),
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const token = req.nextUrl.searchParams.get("token");
  if (!token || token !== process.env.CALLBACK_TOKEN)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { shopOrderId } = requestSchema.parse(body);

  const order = await prisma.order.findUnique({
    where: { id: shopOrderId },
  });

  if (order) {
    if (order.status !== "PENDING")
      return NextResponse.json(
        { error: "Order already processed" },
        { status: 400 },
      );

    const result = await fulfillOrder(order.id);
    return NextResponse.json({ message: "Order created", result });
  }

  // пополнение баланса плазмитами
  const topup = await prisma.topup.findUnique({ where: { id: shopOrderId } });
  if (topup) {
    await completeTopup(topup.id);
    return NextResponse.json({ message: "Topup credited" });
  }

  return NextResponse.json({ error: "Order not found" }, { status: 404 });
};

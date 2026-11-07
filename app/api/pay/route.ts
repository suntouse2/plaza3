import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import z from "zod";
import { createPayment } from "@/lib/paymentService";
import { ProductData } from "@/lib/fulfillment";
import { siteUrl } from "@/data/shared";

const PROJECT_ID = 17;
const MERCHANTS = { sbp: 42, card: 43 } as const;

const payloadSchema = z.object({
  clientId: z.string(),
  serverId: z.string().optional(),
  productId: z.string(),
  promo: z.string().optional(),
  method: z.enum(["sbp", "card"]).default("sbp"),
});

export const POST = async (req: Request) => {
  const body = await req.json();

  const { clientId, productId, promo, serverId, method } =
    payloadSchema.parse(body);

  const product = await prisma.gameProduct.findUnique({
    where: { id: productId },
    include: { category: { include: { game: true, credentials: true } } },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const label = (type: "CLIENT_ID" | "SERVER_ID", fallback: string) =>
    product.category.credentials.find((c) => c.type === type)?.label ??
    fallback;

  const { category, ...rest } = product;
  const secret = crypto.randomBytes(32).toString("hex");

  const order = await prisma.order.create({
    data: {
      productId: product.id,
      productSnapshot: { ...rest, gameTitle: category.game.title },
      paymentMethod: method,
      credentials: [
        {
          label: label("CLIENT_ID", "Игровой ID"),
          value: clientId,
          type: "CLIENT_ID",
        },
        ...(serverId
          ? [
              {
                label: label("SERVER_ID", "ID сервера"),
                value: serverId,
                type: "SERVER_ID",
              },
            ]
          : []),
      ],
      secret,
    },
  });

  const amount = promo
    ? Number((product.price * 0.6).toFixed(0))
    : product.price;

  const shopOrderCostPrice = (product.data as ProductData).rubCost || 0;

  try {
    const payment = await createPayment({
      projectId: PROJECT_ID,
      merchantId: MERCHANTS[method],
      shopOrderId: order.id,
      shopOrderPayload: order,
      shopOrderDomain: siteUrl,
      shopOrderCostPrice,
      amount,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: payment.id,
        paymentUrl: payment.providerPaymentUrl,
      },
    });

    const response = NextResponse.json({
      redirectUrl: payment.providerPaymentUrl,
      orderId: order.id,
    });

    response.cookies.set("secret", secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
};

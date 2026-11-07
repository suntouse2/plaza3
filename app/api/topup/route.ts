import { getServerSideSession } from "@/lib/getServerSideSession";
import { createPayment } from "@/lib/paymentService";
import { siteUrl } from "@/data/shared";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const topupSchema = z.object({
  amount: z.coerce
    .number()
    .min(100, "Минимальная сумма — 100 ₽")
    .max(100000, "Максимальная сумма — 100 000 ₽")
    // не больше 2 знаков после запятой
    .refine(
      (v) => Number.isInteger(Math.round(v * 100)) && (v * 100) % 1 === 0,
      {
        message: "Сумма не может содержать доли копейки",
      }
    ),
  paymentMethod: z.enum(["sbp", "card"]),
});

export const POST = async (req: Request) => {
  const body = await req.json();

  const parsed = topupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Некорректные данные" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const user = await getServerSideSession();
  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 401 }
    );
  }

  const amountKopecks = Math.round(data.amount * 100);
  const amountRub = amountKopecks / 100;

  const topup = await prisma.topup.create({
    data: {
      userId: user.id,
      amount: amountKopecks,
      paymentMethod: data.paymentMethod,
    },
  });

  try {
    const payment = await createPayment({
      amount: amountRub,
      shopOrderId: topup.id,
      shopOrderPayload: { type: "topup" },
      projectId: 6,
      merchantId: data.paymentMethod === "sbp" ? 10 : 12,
      shopOrderDomain: siteUrl,
      ...(user.email ? { email: user.email } : {}),
    });

    await prisma.topup.update({
      where: { id: topup.id },
      data: {
        paymentId: payment.id,
        paymentUrl: payment.providerPaymentUrl,
      },
    });

    return NextResponse.json({ paymentUrl: payment.providerPaymentUrl });
  } catch (error) {
    console.error("[topup] createPayment failed:", error);
    return NextResponse.json(
      { error: "Не удалось создать платёж. Попробуйте ещё раз." },
      { status: 502 },
    );
  }
};

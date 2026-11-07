import "server-only";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { galaxy } from "@/lib/galaxy";
import {
  CredentialType,
  GameProduct,
  OrderStatus,
} from "@/app/generated/prisma/client";

type CredentialEntry = { label: string; value: string; type: CredentialType };

export type ProductData = {
  title?: string;
  product_id?: string;
  user_field?: string;
  category?: string | number;
  quantity?: number;
  rubCost?: number;
};

export type FulfillResult =
  | { ok: true; status: OrderStatus }
  | { ok: false; error: string };

/**
 * Помечает заказ оплаченным и отправляет выдачу поставщику.
 * Идемпотентно: повторный вызов для уже обработанного заказа ничего не делает.
 */
export async function fulfillOrder(orderId: string): Promise<FulfillResult> {
  // атомарно забираем заказ в работу — защищает от двойной выдачи при повторных колбэках
  const providerOrderId = crypto.randomUUID().replaceAll("-", "");
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, status: OrderStatus.PENDING },
    data: { status: OrderStatus.PAID, providerOrderId },
  });
  if (count === 0) return { ok: false, error: "Order already processed" };

  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });
  const product = order.productSnapshot as unknown as GameProduct;
  const credentials = order.credentials as unknown as CredentialEntry[];

  const data = (product.data ?? {}) as ProductData;

  // без кода поставщика заказ остаётся PAID и выдаётся вручную
  if (!data.product_id) return { ok: true, status: OrderStatus.PAID };

  const userId = credentials.find((c) => c.type === "CLIENT_ID")?.value;
  const serverId = credentials.find((c) => c.type === "SERVER_ID")?.value;

  let status: OrderStatus = OrderStatus.FAILED;
  let providerResponse: object;

  if (!userId) {
    providerResponse = { error: "Не указан игровой ID" };
  } else {
    try {
      const response = await galaxy.createTopupOrder({
        productCode: data.product_id,
        quantity: data.quantity,
        userId,
        serverId,
        partnerOrderId: providerOrderId,
      });
      providerResponse = response;
      if (response.code === 0) status = OrderStatus.COMPLETED;
    } catch (e) {
      providerResponse = { error: e instanceof Error ? e.message : String(e) };
    }
  }

  if (status === OrderStatus.FAILED)
    console.error("[fulfillment] delivery failed", orderId, providerResponse);

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status, providerResponse },
    });
    // за плазмиты возвращаем баланс, если выдача не прошла
    if (
      status === OrderStatus.FAILED &&
      order.paymentMethod === "plazmite" &&
      order.userId
    ) {
      await tx.user.update({
        where: { id: order.userId },
        data: { balance: { increment: Math.round(product.price * 100) } },
      });
    }
  });

  return { ok: true, status };
}

/** Зачисляет оплаченное пополнение на баланс. Идемпотентно. */
export async function completeTopup(topupId: string) {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.topup.updateMany({
      where: { id: topupId, status: "PENDING" },
      data: { status: "COMPLETED" },
    });
    if (count === 0) return false;

    const topup = await tx.topup.findUniqueOrThrow({ where: { id: topupId } });
    await tx.user.update({
      where: { id: topup.userId },
      data: { balance: { increment: topup.amount } },
    });
    return true;
  });
}

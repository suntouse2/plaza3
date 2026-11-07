import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

/** Возврат с оплаты: находим заказ покупателя по секрету из cookie */
export default async function Order() {
  const cookiesStore = await cookies();
  const secret = cookiesStore.get("secret")?.value;
  if (!secret) return notFound();

  const order = await prisma.order.findUnique({ where: { secret } });
  if (!order) return notFound();

  redirect(`/orders/${order.id}`);
}

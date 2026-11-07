import "server-only";

export type PaymentCreateParams = {
  projectId?: number;
  merchantId?: number;
  amount: number;
  currency?: string;
  shopOrderId: string;
  shopOrderCostPrice?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shopOrderPayload: Record<string, any>;
  shopOrderDomain: string;
  email?: string;
  ip?: string;
  phone?: string;
};

export type PaymentEntity = {
  id: string;
  merchantId: number;
  amount: number;
  netProfit: number;
  currency?: string;
  status: "PENDING" | "PAID";

  shopOrderId: string;
  shopOrderPayload: Record<string, string | number | boolean | object>;
  shopOrderDomain: string;
  shopOrderCostPrice: number;

  providerPaymentId?: string;
  providerPaymentUrl?: string;

  email?: string;
  ip?: string;
  phone?: string;

  createdAt: string;
  updatedAt: string;
};

export async function createPayment(
  params: PaymentCreateParams
): Promise<PaymentEntity> {
  console.log(params);

  const response = await fetch("https://999payments.site/api/pay/create", {
    method: "POST",
    body: JSON.stringify(params),
  });
  console.log(response);
  if (!response.ok) throw new Error("Failed to create payment");

  const data = await response.json();
  return data;
}

export async function handleCallback(entity: PaymentEntity): Promise<boolean> {
  const {} = entity;
  return true;
}

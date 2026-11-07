import "server-only";
import crypto from "crypto";

const BASE_URL = "https://api.galaxylink.gg";
const CLIENT_ID = Number(process.env.GALAXY_CLIENT_ID || 1369);
const API_KEY = process.env.GALAXY_API_KEY || "";

export type GalaxyResponse<T = unknown> = {
  code: number;
  message: string;
} & T;

export type GalaxyValidateResult = {
  category: { code: string; name: string };
  result: {
    validated: boolean;
    status_message: string;
    data: { user_id: string; server_id?: string; username: string } | null;
  };
};

let tokenCache: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expires > now + 300) return tokenCache.token;

  const sign = crypto
    .createHash("sha256")
    .update(API_KEY + now)
    .digest("hex");

  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, timestamp: now, sign }),
  });
  const data = await res.json();

  if (data.code !== 0 || !data.token)
    throw new Error(`Galaxy auth failed: ${data.message}`);

  tokenCache = {
    token: data.token,
    expires: Math.floor(new Date(data.valid_thru).getTime() / 1000),
  };
  return data.token;
}

async function request<T>(
  method: "GET" | "POST",
  endpoint: string,
  payload: Record<string, unknown> = {},
): Promise<GalaxyResponse<T>> {
  const token = await getToken();
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (method === "GET")
    for (const [key, value] of Object.entries(payload))
      url.searchParams.append(key, String(value));

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", "X-Access-Token": token },
    ...(method === "POST" ? { body: JSON.stringify(payload) } : {}),
  });
  return res.json();
}

export const galaxy = {
  getCategories(type = "topup") {
    return request("GET", "/products/categories", { type });
  },

  getProducts(type: string, category: string) {
    return request("GET", "/products/list", { type, category, rows: 50 });
  },

  getClientBalance() {
    return request("GET", "/client/balance");
  },

  createTopupOrder({
    productCode,
    userId,
    partnerOrderId,
    serverId,
    quantity = 1,
  }: {
    productCode: string;
    userId: string;
    partnerOrderId: string;
    serverId?: string;
    quantity?: number;
  }) {
    return request("POST", "/orders/topup", {
      product_code: productCode,
      quantity,
      user_id: userId,
      partner_order_id: partnerOrderId,
      ...(serverId ? { server_id: serverId } : {}),
    });
  },

  validateUserId(category: string, userFields: Record<string, string>) {
    return request<GalaxyValidateResult>("POST", "/games/validate", {
      category,
      user_fields: userFields,
    });
  },
};

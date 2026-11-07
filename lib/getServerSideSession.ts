import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from "jose";
import type { User } from "@/app/generated/prisma/client";

export async function getServerSideSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  let userId: unknown;
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    userId = payload.userId;
  } catch {
    return null;
  }

  if (!userId || typeof userId !== "string") return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}

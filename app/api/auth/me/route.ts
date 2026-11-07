import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });

  let userId: unknown;
  try {
    ({
      payload: { userId },
    } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    ));
  } catch {
    cookieStore.delete("token");
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }
  if (!userId)
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId as string },
  });
  if (!user)
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });

  return NextResponse.json({ ...user, balance: user.balance / 100 });
}

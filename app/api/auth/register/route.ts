import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as jose from "jose";
import z from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { data, success } = schema.safeParse(body);
  if (!success)
    return NextResponse.json({ message: "Неверный запрос" }, { status: 400 });

  let userId = null;
  let token = null;

  try {
    const user = await prisma.user.create({
      data: { email: data.email, password: data.password },
    });
    userId = user.id;
  } catch {
    return NextResponse.json(
      { message: "Пользователь уже существует" },
      { status: 400 }
    );
  }
  try {
    const jwtToken = await new jose.SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    token = jwtToken;
  } catch {
    return NextResponse.json(
      { message: "Не удалось создать токен" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    message: `Пользователь создан, ваш id: ${userId}`,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  return response;
}

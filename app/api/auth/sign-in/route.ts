import { NextResponse } from "next/server";
import * as jose from "jose";
import z from "zod";
import prisma from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { data, success } = schema.safeParse(body);
  if (!success)
    return NextResponse.json({ message: "Неверный запрос" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: data.email, password: data.password },
  });
  if (!user)
    return NextResponse.json(
      { message: "Аккаунта не найден" },
      { status: 400 }
    );

  try {
    const token = await new jose.SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json({
      message: `Вы вошли в систему, ваш id: ${user.id}`,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Ошибка при входе в систему" },
      { status: 400 }
    );
  }
}

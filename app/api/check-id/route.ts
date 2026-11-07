import { galaxy } from "@/lib/galaxy";
import { NextResponse } from "next/server";
import z from "zod";

const requestSchema = z.object({
  category: z.string(),
  user_fields: z.record(z.string(), z.string()),
});

export const POST = async (req: Request) => {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        validated: false,
        status_message: "Некорректные данные запроса",
        data: null,
      },
      { status: 400 },
    );

  try {
    const response = await galaxy.validateUserId(
      parsed.data.category,
      parsed.data.user_fields,
    );

    if (response.code !== 0)
      return NextResponse.json({
        validated: false,
        status_message: response.message || "Ошибка проверки аккаунта",
        data: null,
      });

    return NextResponse.json(response.result);
  } catch (error) {
    console.error("[check-id]", error);
    return NextResponse.json(
      { validated: false, status_message: "Внутренняя ошибка сервера", data: null },
      { status: 500 },
    );
  }
};

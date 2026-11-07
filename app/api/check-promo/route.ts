export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const promo = searchParams.get("promo");

  if (!promo) return new Response("Promo not found", { status: 404 });

  return new Response("Promo not found", { status: 200 });
};

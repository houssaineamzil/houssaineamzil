import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { pageSlug } = await request.json();

  const data = (await import(`../../../data/${pageSlug}.json`)).default;

  return Response.json(data);
};

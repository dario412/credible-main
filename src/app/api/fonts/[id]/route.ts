import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  if (!id) {
    return new NextResponse("Not found", { status: 404 });
  }

  const asset = await prisma.fontAsset.findUnique({ where: { id } });
  if (!asset) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(Buffer.from(asset.data), {
    status: 200,
    headers: {
      "Content-Type": asset.mimeType || "font/woff2",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

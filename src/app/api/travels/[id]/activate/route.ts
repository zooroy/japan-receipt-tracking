import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.$transaction([
    prisma.travel.updateMany({ where: { is_active: true }, data: { is_active: false } }),
    prisma.travel.update({ where: { id }, data: { is_active: true } }),
  ]);

  revalidateTag("travels", { expire: 0 });
  revalidateTag("receipts", { expire: 0 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const travel = await prisma.travel.findUnique({ where: { id } });
  if (!travel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 先刪除該旅程的所有收據，再刪旅程
  await prisma.$transaction([
    prisma.receipt.deleteMany({ where: { travel_id: id } }),
    prisma.travel.delete({ where: { id } }),
  ]);
  revalidateTag("travels", { expire: 0 });
  revalidateTag("receipts", { expire: 0 });

  return NextResponse.json({ ok: true });
}

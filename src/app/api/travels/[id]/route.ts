import { NextRequest, NextResponse } from "next/server";
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

  if (travel.is_active) {
    return NextResponse.json(
      { error: "無法刪除目前使用中的旅程，請先切換到其他旅程" },
      { status: 400 }
    );
  }

  // 先刪除該旅程的所有收據，再刪旅程
  await prisma.$transaction([
    prisma.receipt.deleteMany({ where: { travel_id: id } }),
    prisma.travel.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}

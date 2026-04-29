import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { analyzeReceipt } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const imageHash = createHash("sha256").update(Buffer.from(buffer)).digest("hex");

  const existing = await prisma.receipt.findUnique({
    where: { image_hash: imageHash },
    include: { travel: { select: { name: true } } },
  });

  if (existing) {
    return NextResponse.json(
      {
        duplicate: true,
        store_name_zh: existing.store_name_zh,
        date: existing.date,
        travel_name: existing.travel.name,
      },
      { status: 409 }
    );
  }

  const base64 = Buffer.from(buffer).toString("base64");
  const data = await analyzeReceipt(base64, file.type);
  return NextResponse.json({ ...data, image_hash: imageHash });
}

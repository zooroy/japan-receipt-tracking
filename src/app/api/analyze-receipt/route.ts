import { NextRequest, NextResponse } from "next/server";
import { analyzeReceipt } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const data = await analyzeReceipt(base64, file.type);
  return NextResponse.json(data);
}

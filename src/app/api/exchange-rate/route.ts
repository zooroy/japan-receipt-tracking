import { NextResponse } from "next/server";
import { getTodayRate } from "@/lib/exchange-rate";

export async function GET() {
  const rate = await getTodayRate();
  return NextResponse.json({ rate });
}

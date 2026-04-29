import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTodayRate, calculateTwd } from "@/lib/exchange-rate";
import { z } from "zod";

const receiptSchema = z.object({
  date: z.string(),
  store_name: z.string(),
  store_name_zh: z.string(),
  total_amount: z.number().int(),
  tax_type: z.enum(["reduced_8", "standard_10", "tax_free", "unknown"]),
  category: z.enum(["food", "shopping", "transport", "accommodation", "sightseeing", "other"]),
  items: z.array(
    z.object({ name: z.string(), name_zh: z.string(), price: z.number().int() })
  ),
  notes: z.string().optional().nullable(),
  image_hash: z.string().optional().nullable(),
});

export async function GET() {
  const activeTravel = await prisma.travel.findFirst({ where: { is_active: true } });
  if (!activeTravel) return NextResponse.json([]);

  const receipts = await prisma.receipt.findMany({
    where: { travel_id: activeTravel.id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(receipts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = receiptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const activeTravel = await prisma.travel.findFirst({ where: { is_active: true } });
  if (!activeTravel) {
    return NextResponse.json({ error: "No active travel" }, { status: 400 });
  }

  const rate = await getTodayRate();
  const { date, store_name, store_name_zh, total_amount, tax_type, category, items, notes, image_hash } = parsed.data;

  const receipt = await prisma.receipt.create({
    data: {
      travel_id: activeTravel.id,
      date: new Date(date),
      store_name,
      store_name_zh,
      total_amount,
      total_amount_twd: calculateTwd(total_amount, rate),
      exchange_rate: rate,
      tax_type,
      category,
      items,
      notes: notes ?? null,
      image_hash: image_hash ?? null,
    },
  });

  return NextResponse.json(receipt, { status: 201 });
}

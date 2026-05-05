import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTravelSchema = z.object({
  name: z.string().min(1),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export async function GET() {
  const travels = await prisma.travel.findMany({
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(travels);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createTravelSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, start_date, end_date } = parsed.data;

  const travel = await prisma.travel.create({
    data: {
      name,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      is_active: false,
    },
  });

  revalidateTag("travels", { expire: 0 });
  return NextResponse.json(travel, { status: 201 });
}

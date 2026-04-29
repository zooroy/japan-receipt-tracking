import { prisma } from "@/lib/prisma";

export async function getTodayRate(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cached = await prisma.exchangeRateCache.findUnique({
    where: { date: today },
  });

  if (cached) return Number(cached.rate);

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/JPY/TWD`
    );
    const data = await res.json();
    const rate: number = data.conversion_rate;

    await prisma.exchangeRateCache.upsert({
      where: { date: today },
      create: { date: today, rate, fetched_at: new Date() },
      update: { rate, fetched_at: new Date() },
    });

    return rate;
  } catch {
    // Fall back to most recent cached rate
    const recent = await prisma.exchangeRateCache.findFirst({
      orderBy: { date: "desc" },
    });
    if (recent) return Number(recent.rate);
    throw new Error("Exchange rate unavailable");
  }
}

export function calculateTwd(jpy: number, rate: number): number {
  return Math.round(jpy * rate);
}

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getTodayRate } from "@/lib/exchange-rate";

export async function getTravels() {
  "use cache";
  cacheTag("travels");
  return prisma.travel.findMany({ orderBy: { created_at: "desc" } });
}

export async function getReceipts() {
  "use cache";
  cacheTag("receipts");
  console.log("▶ getReceipts cache miss - hitting DB"); // 只有 cache miss 才會真正執行
  const rows = await prisma.receipt.findMany({ where: { travel: { is_active: true } }, orderBy: { date: "desc" } });
  return rows.map((r) => ({ ...r, exchange_rate: Number(r.exchange_rate) }));
}

export async function getExchangeRate() {
  "use cache";
  cacheLife("hours");
  cacheTag("exchange-rate");
  return getTodayRate();
}

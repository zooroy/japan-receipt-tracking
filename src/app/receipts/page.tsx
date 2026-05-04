export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getTravels } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ReceiptList } from "@/components/receipts/ReceiptList";
import type { Travel, Receipt } from "@/lib/types";

export default async function ReceiptsPage() {
  const [rawTravels, rawReceipts] = await Promise.all([
    getTravels(),
    prisma.receipt.findMany({ where: { travel: { is_active: true } }, orderBy: { date: "desc" } }),
  ]);

  const travels: Travel[] = rawTravels.map((t) => ({
    ...t,
    start_date: t.start_date?.toISOString() ?? null,
    end_date: t.end_date?.toISOString() ?? null,
    created_at: t.created_at.toISOString(),
  }));
  const activeTravel = travels.find((t: Travel) => t.is_active) ?? null;

  if (!activeTravel) {
    redirect("/travels?new=true");
  }

  const receipts: Receipt[] = rawReceipts.map((r) => ({
    ...r,
    date: r.date.toISOString(),
    exchange_rate: Number(r.exchange_rate),
    created_at: r.created_at.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar travelName={activeTravel.name} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
        <ReceiptList initialReceipts={receipts} />
      </main>
      <BottomNav />
    </div>
  );
}

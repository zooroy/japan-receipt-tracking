import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TravelSwitcher } from "@/components/travels/TravelSwitcher";
import { ReceiptList } from "@/components/receipts/ReceiptList";
import type { Travel, Receipt } from "@/lib/types";

export default async function ReceiptsPage() {
  const travels = (await prisma.travel.findMany({ orderBy: { created_at: "desc" } })) as Travel[];
  const activeTravel = travels.find((t: Travel) => t.is_active) ?? null;

  if (!activeTravel) {
    redirect("/travels?new=true");
  }

  const rawReceipts = await prisma.receipt.findMany({
    where: { travel_id: activeTravel.id },
    orderBy: { date: "desc" },
  });

  const receipts: Receipt[] = rawReceipts.map((r) => ({
    ...r,
    date: r.date.toISOString(),
    exchange_rate: Number(r.exchange_rate),
    created_at: r.created_at.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        travelSwitcher={
          <TravelSwitcher travels={travels} activeTravel={activeTravel} />
        }
      />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <ReceiptList initialReceipts={receipts} travelId={activeTravel.id} />
      </main>
    </div>
  );
}

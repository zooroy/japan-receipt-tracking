import { prisma } from "@/lib/prisma";
import { getTravels } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TravelSwitcher } from "@/components/travels/TravelSwitcher";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";
import { DailyChart, CategoryChart } from "@/components/dashboard/LazyCharts";
import { TaxTypeSummary } from "@/components/dashboard/TaxTypeSummary";
import { RecentReceipts } from "@/components/dashboard/RecentReceipts";
import type { Travel } from "@/lib/types";

export default async function DashboardPage() {
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
  const receipts = rawReceipts.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    store_name_zh: r.store_name_zh,
    total_amount: r.total_amount,
    total_amount_twd: r.total_amount_twd,
    tax_type: r.tax_type,
    category: r.category,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        travelSwitcher={
          <TravelSwitcher travels={travels} activeTravel={activeTravel} />
        }
      />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {receipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-2 text-muted-foreground">
            <p className="text-lg font-medium text-foreground">還沒有收據</p>
            <p className="text-sm">請點右上角「+ 新增收據」來新增</p>
          </div>
        ) : (
          <div className="space-y-4">
            <SpendingOverview travelId={activeTravel.id} initialReceipts={receipts} />
            <DailyChart travelId={activeTravel.id} initialReceipts={receipts} />
            <div className="grid grid-cols-2 gap-4">
              <CategoryChart travelId={activeTravel.id} initialReceipts={receipts} />
              <TaxTypeSummary travelId={activeTravel.id} initialReceipts={receipts} />
            </div>
            <RecentReceipts travelId={activeTravel.id} initialReceipts={receipts} />
          </div>
        )}
      </main>
    </div>
  );
}

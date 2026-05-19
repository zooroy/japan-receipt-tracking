import { Suspense } from "react";
import { getTravels, getReceipts } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";
import { DailyChart, CategoryChart } from "@/components/dashboard/LazyCharts";
import { TaxTypeSummary } from "@/components/dashboard/TaxTypeSummary";
import { RecentReceipts } from "@/components/dashboard/RecentReceipts";
import type { Travel } from "@/lib/types";

export default async function DashboardPage() {
  const [rawTravels, rawReceipts] = await Promise.all([
    getTravels(),
    getReceipts(),
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
    date: new Date(r.date).toISOString(),
    store_name_zh: r.store_name_zh,
    total_amount: r.total_amount,
    total_amount_twd: r.total_amount_twd,
    tax_type: r.tax_type,
    category: r.category,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar travelName={activeTravel.name} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
          {receipts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-2 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">還沒有收據</p>
              <p className="text-sm">請點下方「＋」按鈕來新增</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Suspense fallback={<div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />)}</div>}>
                <SpendingOverview initialReceipts={receipts} />
              </Suspense>
              <DailyChart initialReceipts={receipts} />
              <div className="grid grid-cols-2 gap-4">
                <CategoryChart initialReceipts={receipts} />
                <TaxTypeSummary initialReceipts={receipts} />
              </div>
              <RecentReceipts initialReceipts={receipts} />
            </div>
          )}
      </main>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TravelSwitcher } from "@/components/travels/TravelSwitcher";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";
import { DailyChart } from "@/components/dashboard/DailyChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { TaxTypeSummary } from "@/components/dashboard/TaxTypeSummary";
import { RecentReceipts } from "@/components/dashboard/RecentReceipts";
import type { Travel } from "@/lib/types";

export default async function DashboardPage() {
  const rawTravels = await prisma.travel.findMany({ orderBy: { created_at: "desc" } });
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

  const receiptCount = await prisma.receipt.count({
    where: { travel_id: activeTravel.id },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        travelSwitcher={
          <TravelSwitcher travels={travels} activeTravel={activeTravel} />
        }
      />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {receiptCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-2 text-muted-foreground">
            <p className="text-lg font-medium text-foreground">還沒有收據</p>
            <p className="text-sm">請點右上角「+ 新增收據」來新增</p>
          </div>
        ) : (
          <div className="space-y-4">
            <SpendingOverview travelId={activeTravel.id} />
            <DailyChart travelId={activeTravel.id} />
            <div className="grid grid-cols-2 gap-4">
              <CategoryChart travelId={activeTravel.id} />
              <TaxTypeSummary travelId={activeTravel.id} />
            </div>
            <RecentReceipts travelId={activeTravel.id} />
          </div>
        )}
      </main>
    </div>
  );
}

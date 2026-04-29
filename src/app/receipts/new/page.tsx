import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { TravelSwitcher } from "@/components/travels/TravelSwitcher";
import { NewReceiptClient } from "@/components/receipts/NewReceiptClient";
import type { Travel } from "@/lib/types";

export default async function NewReceiptPage() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        travelSwitcher={
          <TravelSwitcher travels={travels} activeTravel={activeTravel} />
        }
      />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ChevronLeft className="h-4 w-4" />
            返回
          </Link>
        </div>
        <h1 className="text-xl font-semibold mb-6">新增收據</h1>
        <NewReceiptClient />
      </main>
    </div>
  );
}

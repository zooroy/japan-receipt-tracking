import { Suspense } from "react";
import { getTravels } from "@/lib/queries";
import { Navbar } from "@/components/layout/Navbar";
import { TravelList } from "@/components/travels/TravelList";
import { Skeleton } from "@/components/ui/skeleton";
import type { Travel } from "@/lib/types";

function TravelListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

interface TravelsPageProps {
  searchParams: Promise<{ new?: string }>;
}

async function TravelPageContent({ searchParams }: TravelsPageProps) {
  const { new: newParam } = await searchParams;
  const rawTravels = await getTravels();
  const mapped: Travel[] = rawTravels.map((t) => ({
    ...t,
    start_date: t.start_date?.toISOString() ?? null,
    end_date: t.end_date?.toISOString() ?? null,
    created_at: t.created_at.toISOString(),
  }));
  const activeTravel = mapped.find((t: Travel) => t.is_active) ?? null;
  const travels = activeTravel
    ? [activeTravel, ...mapped.filter((t) => !t.is_active)]
    : mapped;

  return (
    <TravelList
      travels={travels}
      activeTravel={activeTravel}
      autoOpenCreate={newParam === "true"}
    />
  );
}

export default function TravelsPage({ searchParams }: TravelsPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar minimal />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
        <Suspense fallback={<TravelListSkeleton />}>
          <TravelPageContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

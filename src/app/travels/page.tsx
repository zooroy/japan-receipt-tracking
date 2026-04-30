import { getTravels } from "@/lib/queries";
import { Navbar } from "@/components/layout/Navbar";
import { TravelList } from "@/components/travels/TravelList";
import type { Travel } from "@/lib/types";

interface TravelsPageProps {
  searchParams: Promise<{ new?: string }>;
}

export default async function TravelsPage({ searchParams }: TravelsPageProps) {
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
    <div className="flex flex-col min-h-screen">
      <Navbar minimal />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <TravelList
          travels={travels}
          activeTravel={activeTravel}
          autoOpenCreate={newParam === "true"}
        />
      </main>
    </div>
  );
}

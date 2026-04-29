"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateTravelDialog } from "./CreateTravelDialog";

import type { Travel } from "@/lib/types";

interface TravelSwitcherProps {
  travels: Travel[];
  activeTravel: Travel | null;
}

export function TravelSwitcher({ travels, activeTravel }: TravelSwitcherProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);

  async function handleSwitch(id: string) {
    setSwitching(id);
    await fetch(`/api/travels/${id}/activate`, { method: "POST" });
    router.refresh();
    setSwitching(null);
  }

  if (travels.length === 0) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-3 w-3" />
          建立旅程
        </Button>
        <CreateTravelDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => router.refresh()}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground max-w-[180px] overflow-hidden">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{activeTravel?.name ?? "選擇旅程"}</span>
          <ChevronDown className="h-3 w-3 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {travels.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => !t.is_active && handleSwitch(t.id)}
              className={t.is_active ? "font-semibold" : ""}
              disabled={switching === t.id}
            >
              {t.is_active && <span className="mr-1">✓</span>}
              {t.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            建立新旅程
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTravelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}

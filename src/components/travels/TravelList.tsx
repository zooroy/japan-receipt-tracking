"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreateTravelDialog } from "./CreateTravelDialog";

import type { Travel } from "@/lib/types";

interface TravelListProps {
  travels: Travel[];
  activeTravel: Travel | null;
  autoOpenCreate?: boolean;
}

export function TravelList({ travels, activeTravel, autoOpenCreate }: TravelListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(autoOpenCreate ?? false);
  const [switching, setSwitching] = useState<string | null>(null);

  useEffect(() => {
    if (autoOpenCreate) setDialogOpen(true);
  }, [autoOpenCreate]);

  async function handleSwitch(id: string) {
    setSwitching(id);
    await fetch(`/api/travels/${id}/activate`, { method: "POST" });
    router.refresh();
    setSwitching(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">我的旅程</h1>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          新增旅程
        </Button>
      </div>

      {travels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p>還沒有旅程</p>
          <p className="text-sm mt-1">建立第一個旅程開始記帳吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {travels.map((travel) => {
            const isActive = travel.id === activeTravel?.id;
            return (
              <Card
                key={travel.id}
                className={isActive ? "border-primary/50 bg-primary/5" : ""}
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{travel.name}</span>
                      {isActive && (
                        <Badge variant="default" className="text-xs shrink-0">
                          目前旅程
                        </Badge>
                      )}
                    </div>
                    {(travel.start_date || travel.end_date) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {travel.start_date
                          ? format(new Date(travel.start_date), "yyyy/MM/dd")
                          : "—"}
                        {" ～ "}
                        {travel.end_date
                          ? format(new Date(travel.end_date), "yyyy/MM/dd")
                          : "—"}
                      </p>
                    )}
                  </div>
                  {!isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSwitch(travel.id)}
                      disabled={switching === travel.id}
                      className="shrink-0"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      切換
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateTravelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}

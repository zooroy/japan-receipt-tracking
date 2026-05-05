"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [deleteTarget, setDeleteTarget] = useState<Travel | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleSwitch(id: string, redirect = false) {
    setSwitching(id);
    await fetch(`/api/travels/${id}/activate`, { method: "POST" });
    setSwitching(null);
    if (redirect) {
      router.push("/");
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");

    const res = await fetch(`/api/travels/${deleteTarget.id}`, { method: "DELETE" });

    if (res.ok) {
      setDeleteTarget(null);
      router.refresh();
    } else {
      const data = await res.json();
      setDeleteError(data.error ?? "刪除失敗");
    }
    setDeleting(false);
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
                className={`transition-colors ${switching === travel.id ? "opacity-60 cursor-wait pointer-events-none" : "cursor-pointer hover:bg-muted/50"} ${isActive ? "border-primary/50 bg-primary/5" : ""}`}
                onClick={() => isActive ? router.push("/") : handleSwitch(travel.id, true)}
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {switching === travel.id && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
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
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(travel); }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

      {/* 刪除確認 Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>刪除旅程</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            確定要刪除「<span className="font-medium text-foreground">{deleteTarget?.name}</span>」嗎？
          </p>
          <p className="text-sm text-destructive">此旅程的所有收據也會一併刪除，無法復原。</p>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteTarget(null); setDeleteError(""); }} disabled={deleting}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "刪除中..." : "確定刪除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

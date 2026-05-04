"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, ChevronLeft, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getCategoryLabel, getCategoryColor } from "@/lib/categories";

interface ReceiptItem {
  name: string;
  name_zh: string;
  price: number;
}

interface ReceiptRow {
  id: string;
  date: Date | string;
  store_name: string;
  store_name_zh: string;
  total_amount: number;
  total_amount_twd: number;
  exchange_rate: number | string;
  tax_type: string;
  category: string;
  items: ReceiptItem[] | unknown;
  notes: string | null;
}

const TAX_TYPE_LABELS: Record<string, string> = {
  reduced_8: "8%軽減",
  standard_10: "10%標準",
  tax_free: "免稅",
  unknown: "不明",
};

interface ReceiptListProps {
  initialReceipts: ReceiptRow[];
}

export function ReceiptList({ initialReceipts }: ReceiptListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReceiptRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    const res = await fetch(`/api/receipts/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteTarget(null);
      router.refresh();
    } else {
      const data = await res.json();
      setDeleteError(data.error ?? "刪除失敗");
    }
    setDeleting(false);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return initialReceipts;
    const q = search.toLowerCase();
    return initialReceipts.filter((r) => {
      const itemsArr = Array.isArray(r.items) ? (r.items as ReceiptItem[]) : [];
      return (
        r.store_name.toLowerCase().includes(q) ||
        r.store_name_zh.toLowerCase().includes(q) ||
        itemsArr.some(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.name_zh.toLowerCase().includes(q)
        )
      );
    });
  }, [initialReceipts, search]);

  const totalJpy = filtered.reduce((s, r) => s + r.total_amount, 0);
  const totalTwd = filtered.reduce((s, r) => s + r.total_amount_twd, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">收據列表</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="搜尋店名、品項..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary bar */}
      <div className="flex gap-4 text-sm bg-muted/50 rounded-lg px-4 py-3">
        <span className="text-muted-foreground">{filtered.length} 筆</span>
        <Separator orientation="vertical" className="h-4 self-center" />
        <span className="font-medium">¥{totalJpy.toLocaleString()}</span>
        <Separator orientation="vertical" className="h-4 self-center" />
        <span className="font-medium text-muted-foreground">NT${totalTwd.toLocaleString()}</span>
      </div>

      {/* Receipt rows */}
      {filtered.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground text-sm">找不到符合的收據</p>
      ) : (
        <div className="divide-y border rounded-lg overflow-hidden">
          {filtered.map((r) => {
            const isOpen = expandedId === r.id;
            const itemsArr = Array.isArray(r.items) ? (r.items as ReceiptItem[]) : [];

            return (
              <Collapsible
                key={r.id}
                open={isOpen}
                onOpenChange={(open) => setExpandedId(open ? r.id : null)}
              >
                <CollapsibleTrigger className="w-full text-left flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{r.store_name_zh}</span>
                      <Badge
                        className="text-xs shrink-0 border-0"
                        style={{
                          backgroundColor: `${getCategoryColor(r.category)}30`,
                          color: getCategoryColor(r.category),
                        }}
                      >
                        {getCategoryLabel(r.category)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(r.date), "yyyy/MM/dd")} · {TAX_TYPE_LABELS[r.tax_type] ?? r.tax_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-sm font-semibold">¥{r.total_amount.toLocaleString()}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-3 pt-0 border-t bg-muted/30 space-y-2">
                    {/* TWD + rate */}
                    <div className="flex justify-between text-xs text-muted-foreground pt-2">
                      <span>台幣金額</span>
                      <span>NT${r.total_amount_twd.toLocaleString()} (匯率 {Number(r.exchange_rate).toFixed(4)})</span>
                    </div>

                    {/* Items */}
                    {itemsArr.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">品項明細</p>
                        <div className="divide-y divide-border/50">
                          {itemsArr.map((item, i) => (
                            <div key={i} className="flex justify-between py-1 text-xs">
                              <span className="text-muted-foreground">{item.name_zh}</span>
                              <span>¥{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {r.notes && (
                      <p className="text-xs text-muted-foreground">備註：{r.notes}</p>
                    )}

                    {/* Delete */}
                    <div className="flex justify-end pt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        刪除收據
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* 刪除確認 Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>刪除收據</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            確定要刪除「<span className="font-medium text-foreground">{deleteTarget?.store_name_zh}</span>」的收據嗎？
          </p>
          <p className="text-sm text-destructive">此操作無法復原。</p>
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

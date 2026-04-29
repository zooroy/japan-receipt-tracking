"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Search, Receipt } from "lucide-react";
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

const CATEGORY_LABELS: Record<string, string> = {
  food: "飲食",
  shopping: "購物",
  transport: "交通",
  accommodation: "住宿",
  sightseeing: "觀光",
  other: "其他",
};

const TAX_TYPE_LABELS: Record<string, string> = {
  reduced_8: "8%軽減",
  standard_10: "10%標準",
  tax_free: "免稅",
  unknown: "不明",
};

interface ReceiptListProps {
  initialReceipts: ReceiptRow[];
  travelId: string;
}

export function ReceiptList({ initialReceipts }: ReceiptListProps) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">收據列表</h1>
        <Link href="/receipts/new">
          <Button size="sm">+ 新增</Button>
        </Link>
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
      {initialReceipts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Receipt className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p>還沒有收據</p>
          <Link href="/receipts/new">
            <Button size="sm" className="mt-3">拍攝第一張收據</Button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
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
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {CATEGORY_LABELS[r.category] ?? r.category}
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
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}

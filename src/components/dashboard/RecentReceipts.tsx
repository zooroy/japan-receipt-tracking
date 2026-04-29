"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

interface ReceiptItem {
  id: string;
  date: string;
  store_name_zh: string;
  total_amount: number;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  food: "飲食",
  shopping: "購物",
  transport: "交通",
  accommodation: "住宿",
  sightseeing: "觀光",
  other: "其他",
};

interface RecentReceiptsProps {
  travelId: string;
}

export function RecentReceipts({ travelId }: RecentReceiptsProps) {
  const { data: receipts, isLoading } = useQuery<ReceiptItem[]>({
    queryKey: ["receipts", travelId],
    queryFn: () => fetch("/api/receipts").then((r) => r.json()),
  });

  const recent = receipts?.slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">最近收據</CardTitle>
        <Link href="/receipts">
          <Button variant="ghost" size="sm" className="text-xs h-7">
            查看全部
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-0">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">還沒有收據</p>
            <Link href="/receipts/new">
              <Button size="sm" className="mt-3">拍攝第一張收據</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.store_name_zh}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(r.date), "M/d")} · {CATEGORY_LABELS[r.category] ?? r.category}
                  </p>
                </div>
                <span className="text-sm font-medium ml-3 shrink-0">
                  ¥{r.total_amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

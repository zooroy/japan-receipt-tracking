"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  initialReceipts: ReceiptItem[];
}

export function RecentReceipts({ travelId, initialReceipts }: RecentReceiptsProps) {
  const { data: receipts, isLoading } = useQuery<ReceiptItem[]>({
    queryKey: ["receipts", travelId],
    queryFn: () => fetch(`/api/receipts?travelId=${travelId}`).then((r) => r.json()),
    initialData: initialReceipts,
  });

  const recent = receipts?.slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">最近收據</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {isLoading ? (
          <div className="space-y-3 px-6 pb-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : (
          <>
            <div className="divide-y px-6">
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
            <Link href="/receipts" className="block border-t">
              <p className="text-xs text-muted-foreground text-center py-2.5 hover:text-foreground transition-colors">
                查看全部 →
              </p>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}

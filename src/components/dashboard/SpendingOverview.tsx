"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, JapaneseYen, DollarSign, TrendingUp } from "lucide-react";

interface ReceiptSummary {
  total_amount: number;
  total_amount_twd: number;
}

interface SpendingOverviewProps {
  travelId: string;
}

export function SpendingOverview({ travelId }: SpendingOverviewProps) {
  const { data: receipts, isLoading: receiptsLoading } = useQuery<ReceiptSummary[]>({
    queryKey: ["receipts", travelId],
    queryFn: () => fetch("/api/receipts").then((r) => r.json()),
  });

  const { data: rateData, isLoading: rateLoading } = useQuery<{ rate: number }>({
    queryKey: ["exchange-rate"],
    queryFn: () => fetch("/api/exchange-rate").then((r) => r.json()),
  });

  const totalJpy = receipts?.reduce((sum, r) => sum + r.total_amount, 0) ?? 0;
  const totalTwd = receipts?.reduce((sum, r) => sum + r.total_amount_twd, 0) ?? 0;
  const count = receipts?.length ?? 0;

  const cards = [
    {
      title: "總花費（日圓）",
      value: receiptsLoading ? null : `¥${totalJpy.toLocaleString()}`,
      icon: JapaneseYen,
    },
    {
      title: "總花費（台幣）",
      value: receiptsLoading ? null : `NT$${totalTwd.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "收據筆數",
      value: receiptsLoading ? null : `${count} 筆`,
      icon: Receipt,
    },
    {
      title: "今日匯率",
      value: rateLoading ? null : rateData ? `1 JPY = ${rateData.rate.toFixed(4)} TWD` : "—",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <card.icon className="h-3 w-3" />
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            {card.value === null ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-lg font-semibold leading-tight">{card.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

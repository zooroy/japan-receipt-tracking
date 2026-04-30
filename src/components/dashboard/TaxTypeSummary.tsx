"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Receipt {
  tax_type: string;
  total_amount: number;
}

const TAX_TYPE_LABELS: Record<string, string> = {
  reduced_8: "8% 輕減稅率",
  standard_10: "10% 標準稅率",
  tax_free: "免稅",
  unknown: "不明",
};

interface TaxTypeSummaryProps {
  travelId: string;
  initialReceipts: Receipt[];
}

export function TaxTypeSummary({ travelId, initialReceipts }: TaxTypeSummaryProps) {
  const { data: receipts, isLoading } = useQuery<Receipt[]>({
    queryKey: ["receipts", travelId],
    queryFn: () => fetch(`/api/receipts?travelId=${travelId}`).then((r) => r.json()),
    initialData: initialReceipts,
  });

  const byTaxType = (() => {
    if (!receipts) return [];
    const map: Record<string, number> = {};
    for (const r of receipts) {
      map[r.tax_type] = (map[r.tax_type] ?? 0) + r.total_amount;
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([type, amount]) => ({ type, amount }));
  })();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">稅別匯總</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : byTaxType.length === 0 ? (
          <p className="text-center text-muted-foreground text-xs py-6">尚無資料</p>
        ) : (
          <div className="space-y-2">
            {byTaxType.map(({ type, amount }) => (
              <div key={type} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{TAX_TYPE_LABELS[type] ?? type}</p>
                <p className="text-sm font-medium">¥{amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

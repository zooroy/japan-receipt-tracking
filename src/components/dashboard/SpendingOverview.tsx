import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, JapaneseYen, DollarSign, TrendingUp } from "lucide-react";
import { getExchangeRate } from "@/lib/queries";

interface ReceiptSummary {
  total_amount: number;
  total_amount_twd: number;
}

interface SpendingOverviewProps {
  initialReceipts: ReceiptSummary[];
}

export async function SpendingOverview({ initialReceipts }: SpendingOverviewProps) {
  const rate = await getExchangeRate();

  const totalJpy = initialReceipts.reduce((sum, r) => sum + r.total_amount, 0);
  const totalTwd = initialReceipts.reduce((sum, r) => sum + r.total_amount_twd, 0);
  const count = initialReceipts.length;

  const cards = [
    {
      title: "總花費（日圓）",
      value: `¥${totalJpy.toLocaleString()}`,
      icon: JapaneseYen,
    },
    {
      title: "總花費（台幣）",
      value: `NT$${totalTwd.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "收據筆數",
      value: `${count} 筆`,
      icon: Receipt,
    },
    {
      title: "今日匯率",
      value: `1 JPY = ${rate.toFixed(4)} TWD`,
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
            <p className="text-lg font-semibold leading-tight">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

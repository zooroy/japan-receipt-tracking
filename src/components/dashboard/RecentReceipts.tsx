import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryLabel, getCategoryColor } from "@/lib/categories";

interface ReceiptItem {
  id: string;
  date: string;
  store_name_zh: string;
  total_amount: number;
  category: string;
}

interface RecentReceiptsProps {
  initialReceipts: ReceiptItem[];
}

export function RecentReceipts({ initialReceipts }: RecentReceiptsProps) {
  const recent = initialReceipts.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">最近收據</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        <div className="divide-y px-6">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.store_name_zh}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {format(new Date(r.date), "M/d")}
                  <span>·</span>
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: getCategoryColor(r.category) }}
                  />
                  {getCategoryLabel(r.category)}
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
      </CardContent>
    </Card>
  );
}

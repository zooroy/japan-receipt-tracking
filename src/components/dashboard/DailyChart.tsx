"use client";

import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Receipt {
  date: string;
  total_amount: number;
}

interface SpendingEntry {
  date: string;
  amount: number;
}

interface DailyChartProps {
  initialReceipts: Receipt[];
}

export function DailyChart({ initialReceipts }: DailyChartProps) {
  const chartData: SpendingEntry[] = (() => {
    if (!initialReceipts) return [];
    const byDate: Record<string, number> = {};
    for (const r of initialReceipts) {
      const d = r.date.slice(0, 10);
      byDate[d] = (byDate[d] ?? 0) + r.total_amount;
    }
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({
        date: format(new Date(date), "M/d"),
        amount,
      }));
  })();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">每日消費趨勢（¥）</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">尚無資料</p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, "花費"]}
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar dataKey="amount" fill="var(--primary)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

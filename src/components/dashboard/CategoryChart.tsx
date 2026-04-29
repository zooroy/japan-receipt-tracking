"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Receipt {
  category: string;
  total_amount: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  food: "飲食",
  shopping: "購物",
  transport: "交通",
  accommodation: "住宿",
  sightseeing: "觀光",
  other: "其他",
};

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];

interface CategoryChartProps {
  travelId: string;
}

export function CategoryChart({ travelId }: CategoryChartProps) {
  const { data: receipts, isLoading } = useQuery<Receipt[]>({
    queryKey: ["receipts", travelId],
    queryFn: () => fetch("/api/receipts").then((r) => r.json()),
  });

  const chartData = (() => {
    if (!receipts) return [];
    const byCategory: Record<string, number> = {};
    for (const r of receipts) {
      byCategory[r.category] = (byCategory[r.category] ?? 0) + r.total_amount;
    }
    return Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({
        name: CATEGORY_LABELS[category] ?? category,
        value: amount,
      }));
  })();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">消費分類（¥）</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">尚無資料</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                label={false}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, ""]}
              />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

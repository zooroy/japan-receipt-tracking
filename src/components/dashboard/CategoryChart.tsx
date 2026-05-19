"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryLabel, getCategoryColor } from "@/lib/categories";

interface Receipt {
  category: string;
  total_amount: number;
}

interface CategoryChartProps {
  initialReceipts: Receipt[];
}

export function CategoryChart({ initialReceipts }: CategoryChartProps) {
  const chartData = (() => {
    if (!initialReceipts) return [];
    const byCategory: Record<string, number> = {};
    for (const r of initialReceipts) {
      byCategory[r.category] = (byCategory[r.category] ?? 0) + r.total_amount;
    }
    return Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({
        name: getCategoryLabel(category),
        value: amount,
        color: getCategoryColor(category),
      }));
  })();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">消費分類（¥）</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
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
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, ""]}
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
              />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DailyChart = dynamic(
  () => import("./DailyChart").then((m) => m.DailyChart),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    ),
  }
);

export const CategoryChart = dynamic(
  () => import("./CategoryChart").then((m) => m.CategoryChart),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[180px] w-full" />
        </CardContent>
      </Card>
    ),
  }
);

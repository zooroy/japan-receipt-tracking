"use client";

import dynamic from "next/dynamic";

export const DailyChart = dynamic(() =>
  import("./DailyChart").then((m) => m.DailyChart), { ssr: false }
);

export const CategoryChart = dynamic(() =>
  import("./CategoryChart").then((m) => m.CategoryChart), { ssr: false }
);

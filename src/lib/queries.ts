import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getTravels = cache(() =>
  prisma.travel.findMany({ orderBy: { created_at: "desc" } })
);

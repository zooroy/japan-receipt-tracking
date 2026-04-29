"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReceiptData } from "@/lib/gemini";

const schema = z.object({
  date: z.string(),
  store_name: z.string().min(1),
  store_name_zh: z.string().min(1),
  total_amount: z.number().int().positive(),
  tax_type: z.enum(["reduced_8", "standard_10", "tax_free", "unknown"]),
  category: z.enum(["food", "shopping", "transport", "accommodation", "sightseeing", "other"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TAX_TYPE_LABELS = {
  reduced_8: "8% 輕減稅率",
  standard_10: "10% 標準稅率",
  tax_free: "免稅",
  unknown: "不明",
};

const CATEGORY_LABELS = {
  food: "飲食",
  shopping: "購物",
  transport: "交通",
  accommodation: "住宿",
  sightseeing: "觀光",
  other: "其他",
};

interface ReceiptConfirmProps {
  data: ReceiptData;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function ReceiptConfirm({ data, onCancel, onSuccess }: ReceiptConfirmProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: data.date,
      store_name: data.store_name,
      store_name_zh: data.store_name_zh,
      total_amount: data.total_amount,
      tax_type: data.tax_type,
      category: data.category,
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const res = await fetch("/api/receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, items: data.items, image_hash: data.image_hash }),
    });

    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ["receipts"] });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/receipts");
        router.refresh();
      }
    } else {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>店名（日文）</Label>
          <Input {...register("store_name")} />
        </div>
        <div className="space-y-2">
          <Label>店名（中文）</Label>
          <Input {...register("store_name_zh")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>消費日期</Label>
          <Input type="date" {...register("date")} />
        </div>
        <div className="space-y-2">
          <Label>總金額（¥）</Label>
          <Input type="number" {...register("total_amount", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>稅別</Label>
          <Select
            defaultValue={data.tax_type}
            onValueChange={(v) => setValue("tax_type", v as FormValues["tax_type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TAX_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>分類</Label>
          <Select
            defaultValue={data.category}
            onValueChange={(v) => setValue("category", v as FormValues["category"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.items.length > 0 && (
        <div className="space-y-2">
          <Label>品項明細</Label>
          <div className="rounded-md border divide-y text-sm">
            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">{item.name_zh}</span>
                <span>¥{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>備註</Label>
        <Textarea placeholder="選填" {...register("notes")} rows={2} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          重新拍照
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "儲存中..." : "儲存收據"}
        </Button>
      </div>
    </form>
  );
}

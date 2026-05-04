"use client";

import { useState, useEffect, useRef } from "react";
import { ReceiptConfirm } from "./ReceiptConfirm";
import type { ReceiptData } from "@/lib/gemini";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type State = "analyzing" | "confirm" | "error";

interface NewReceiptClientProps {
  onSuccess?: () => void;
  onStateChange?: (state: State) => void;
  onClose?: () => void;
  initialFile?: File;
}

export function NewReceiptClient({ onSuccess, onStateChange, onClose, initialFile }: NewReceiptClientProps = {}) {
  const [state, setState] = useState<State>("analyzing");
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState("");
  const analyzedRef = useRef(false);

  async function analyzeFile(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/analyze-receipt", { method: "POST", body: formData });

    if (res.ok) {
      const data = await res.json();
      setReceiptData(data);
      setState("confirm");
      onStateChange?.("confirm");
    } else if (res.status === 409) {
      const { store_name_zh, date, travel_name } = await res.json();
      const dateStr = new Date(date).toLocaleDateString("zh-TW");
      setError(`此收據已重複：${store_name_zh}（${dateStr}）收錄於「${travel_name}」`);
      setState("error");
    } else if (res.status === 422) {
      setError("這不是日本收據，請上傳日本消費收據");
      setState("error");
    } else {
      setError("無法解析收據，請重試");
      setState("error");
    }
  }

  useEffect(() => {
    if (initialFile && !analyzedRef.current) {
      analyzedRef.current = true;
      analyzeFile(initialFile);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFile]);

  if (state === "analyzing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>AI 正在分析收據...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-center text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={onClose}>關閉</Button>
      </div>
    );
  }

  if (state === "confirm" && receiptData) {
    return (
      <ReceiptConfirm
        data={receiptData}
        onCancel={() => onClose?.()}
        onSuccess={onSuccess}
      />
    );
  }

  return null;
}

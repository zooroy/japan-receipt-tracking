"use client";

import { useState } from "react";
import { ReceiptCapture } from "./ReceiptCapture";
import { ReceiptConfirm } from "./ReceiptConfirm";
import type { ReceiptData } from "@/lib/gemini";
import { Loader2 } from "lucide-react";

type State = "idle" | "analyzing" | "confirm";

interface NewReceiptClientProps {
  onSuccess?: () => void;
  onStateChange?: (state: State) => void;
}

export function NewReceiptClient({ onSuccess, onStateChange }: NewReceiptClientProps = {}) {
  const [state, setState] = useState<State>("idle");
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState("");

  function setStateWithNotify(next: State) {
    setState(next);
    onStateChange?.(next);
  }

  async function handleImageSelected(file: File) {
    setStateWithNotify("analyzing");
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/analyze-receipt", { method: "POST", body: formData });

    if (res.ok) {
      const data = await res.json();
      setReceiptData(data);
      setStateWithNotify("confirm");
    } else if (res.status === 409) {
      const { store_name_zh, date, travel_name } = await res.json();
      const dateStr = new Date(date).toLocaleDateString("zh-TW");
      setError(`此收據已重複：${store_name_zh}（${dateStr}）收錄於「${travel_name}」`);
      setStateWithNotify("idle");
    } else {
      setError("無法解析收據，請重試或手動輸入");
      setStateWithNotify("idle");
    }
  }

  if (state === "analyzing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>AI 正在分析收據...</p>
      </div>
    );
  }

  if (state === "confirm" && receiptData) {
    return (
      <ReceiptConfirm
        data={receiptData}
        onCancel={() => { setStateWithNotify("idle"); setReceiptData(null); }}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground text-sm">
        拍攝或從相簿選取收據，AI 將自動擷取資訊
      </p>
      <ReceiptCapture onImageSelected={handleImageSelected} />
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewReceiptClient } from "./NewReceiptClient";

type ReceiptState = "idle" | "analyzing" | "confirm";

interface NewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewReceiptDialog({ open, onOpenChange }: NewReceiptDialogProps) {
  const router = useRouter();
  const [receiptState, setReceiptState] = useState<ReceiptState>("idle");
  const showCloseButton = receiptState !== "analyzing";

  function handleOpenChange(next: boolean) {
    if (!next) {
      if (receiptState === "analyzing") return;
      setReceiptState("idle");
    }
    onOpenChange(next);
  }

  function handleSuccess() {
    onOpenChange(false);
    setReceiptState("idle");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} disablePointerDismissal={receiptState !== "idle"}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto" showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>新增收據</DialogTitle>
        </DialogHeader>
        <NewReceiptClient onSuccess={handleSuccess} onStateChange={setReceiptState} />
      </DialogContent>
    </Dialog>
  );
}

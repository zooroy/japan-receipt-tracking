"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewReceiptClient } from "./NewReceiptClient";

type ReceiptState = "analyzing" | "confirm" | "error";

interface NewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFile?: File;
}

export function NewReceiptDialog({ open, onOpenChange, initialFile }: NewReceiptDialogProps) {
  const router = useRouter();

  function handleSuccess() {
    onOpenChange(false);
    router.refresh();
  }

  function handleStateChange(state: ReceiptState) {
    if (state === "analyzing") return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal={true}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>新增收據</DialogTitle>
        </DialogHeader>
        <NewReceiptClient
          onSuccess={handleSuccess}
          onStateChange={handleStateChange}
          onClose={() => onOpenChange(false)}
          initialFile={initialFile}
        />
      </DialogContent>
    </Dialog>
  );
}

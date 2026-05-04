"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewReceiptClient } from "./NewReceiptClient";

interface NewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFile?: File;
  onSuccess?: () => void;
  fileProgress?: { current: number; total: number };
}

export function NewReceiptDialog({ open, onOpenChange, initialFile, onSuccess, fileProgress }: NewReceiptDialogProps) {
  const router = useRouter();

  function handleSuccess() {
    router.refresh();
    onSuccess?.();
  }

  const title = fileProgress
    ? `新增收據（${fileProgress.current}／${fileProgress.total}）`
    : "新增收據";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal={true}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <NewReceiptClient
          onSuccess={handleSuccess}
          onClose={() => onOpenChange(false)}
          initialFile={initialFile}
        />
      </DialogContent>
    </Dialog>
  );
}

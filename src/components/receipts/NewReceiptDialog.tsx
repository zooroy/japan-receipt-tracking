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
}

export function NewReceiptDialog({ open, onOpenChange }: NewReceiptDialogProps) {
  const router = useRouter();

  function handleSuccess() {
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新增收據</DialogTitle>
        </DialogHeader>
        <NewReceiptClient onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

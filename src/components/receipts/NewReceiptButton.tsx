"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewReceiptDialog } from "./NewReceiptDialog";

interface NewReceiptButtonProps {
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
  children?: React.ReactNode;
}

export function NewReceiptButton({ size = "default", children = "+ 新增收據" }: NewReceiptButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>{children}</Button>
      <NewReceiptDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ReceiptText, Plus, Luggage } from "lucide-react";
import { NewReceiptDialog } from "@/components/receipts/NewReceiptDialog";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "儀表板" },
  { href: "/receipts", icon: ReceiptText, label: "收據" },
  { href: "/travels", icon: Luggage, label: "旅程" },
];

export function BottomNav() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDialogOpen(true);
    }
    e.target.value = "";
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setDialogOpen(false);
      setSelectedFile(null);
    }
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {label}
              </Link>
            );
          })}

          {/* 新增按鈕 */}
          <div className="flex flex-col items-center flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
              aria-label="新增收據"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {NAV_ITEMS.slice(2).map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <NewReceiptDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        initialFile={selectedFile ?? undefined}
      />
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { NewReceiptDialog } from "@/components/receipts/NewReceiptDialog";

interface NavbarProps {
  travelSwitcher?: React.ReactNode;
  minimal?: boolean;
}

export function Navbar({ travelSwitcher, minimal }: NavbarProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

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
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/" className="font-semibold text-sm">
            🇯🇵 記帳
          </Link>
        </div>
        {!minimal && <div className="flex-1 min-w-0">{travelSwitcher}</div>}
        <div className="flex items-center gap-2 shrink-0">
          {!minimal && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                + 新增收據
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={handleSignOut} title="登出">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <NewReceiptDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          initialFile={selectedFile ?? undefined}
        />
      </div>
    </header>
  );
}

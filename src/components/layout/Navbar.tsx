"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface NavbarProps {
  travelSwitcher?: React.ReactNode;
}

export function Navbar({ travelSwitcher }: NavbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-sm shrink-0">
          🇯🇵 記帳
        </Link>
        <div className="flex-1 min-w-0">{travelSwitcher}</div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/receipts/new">
            <Button size="sm">+ 新增收據</Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleSignOut} title="登出">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

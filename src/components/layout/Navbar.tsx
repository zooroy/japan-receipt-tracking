"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface NavbarProps {
  travelName?: string;
  minimal?: boolean;
}

export function Navbar({ travelName, minimal }: NavbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-background">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="記帳" width={28} height={28} />
            <span className="font-semibold text-sm">日本記帳</span>
          </Link>
        </div>
        {!minimal && travelName && (
          <span className="flex-1 text-sm text-muted-foreground truncate">{travelName}</span>
        )}
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="登出">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

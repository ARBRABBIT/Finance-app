"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { List, Plus, User } from "lucide-react";

export default function QuickActionsBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:hidden">
      <div className="mx-auto max-w-[480px] px-6 py-2 grid grid-cols-3 items-end">
        <Button asChild variant="outline" size="icon" className="justify-self-start size-12 rounded-full">
          <Link href="/transactions" aria-label="Transactions">
            <List className="size-8" />
          </Link>
        </Button>

        <Link href="/add" aria-label="Add transaction" className="justify-self-center -translate-y-5">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl border">
            <Plus className="size-9" />
          </div>
        </Link>

        <Button asChild variant="outline" size="icon" className="justify-self-end size-12 rounded-full">
          <Link href="/profile" aria-label="Profile">
            <User className="size-8" />
          </Link>
        </Button>
      </div>
    </div>
  );
}



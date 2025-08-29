"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import AddTransaction from "@/components/AddTransaction";
import { formatINR } from "@/lib/format";
import { loadTransactions, getCurrentMonthTotals, loadBudgetAmount } from "@/lib/store";
import Link from "next/link";

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const transactions = useMemo(() => (mounted ? loadTransactions() : []), [mounted, refresh]);
  const totals = useMemo(() => getCurrentMonthTotals(transactions), [transactions]);
  const budgetLeft = useMemo(() => {
    if (!mounted) return 0;
    const budget = loadBudgetAmount();
    return Math.max(0, budget - totals.expenses);
  }, [mounted, totals]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">This Month</div>
          <div className="text-2xl font-semibold" suppressHydrationWarning>
            {formatINR(totals.expenses)}
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Budget Left</div>
          <div className="text-2xl font-semibold" suppressHydrationWarning>
            {formatINR(budgetLeft)}
          </div>
        </Card>
      </div>

      <Card className="p-3 hidden md:block">
        <div className="text-sm font-medium mb-2">Quick actions</div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" asChild>
            <Link href="/add">Add</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/transactions">Transactions</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
        </div>
      </Card>

      <AddTransaction onAdded={() => setRefresh((v) => v + 1)} />

      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Recent Activity</div>
          <Link href="/transactions" className="text-xs text-primary underline">View all</Link>
        </div>
        {transactions.length === 0 ? (
          <div className="text-sm text-muted-foreground">No transactions yet.</div>
        ) : (
          <div className="space-y-2 text-sm">
            {transactions.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.category}</div>
                  <div className="text-xs text-muted-foreground">{t.date}{t.note ? ` · ${t.note}` : ""}</div>
                </div>
                <div className={t.type === "expense" ? "text-red-600" : "text-green-600"}>
                  {t.type === "expense" ? "-" : "+"}{formatINR(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

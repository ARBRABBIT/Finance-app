"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadTransactions, Transaction, loadCategories, saveTransactions } from "@/lib/store";
import { formatINR } from "@/lib/format";

export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const categories = useMemo(() => loadCategories(), []);
  const all = useMemo(() => (mounted ? loadTransactions() : []), [mounted, refresh]);

  const filtered = useMemo(() => {
    return all.filter((t) => {
      if (type && t.type !== type) return false;
      if (category && t.category !== category) return false;
      if (query && !(t.note || "").toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [all, query, category, type]);

  function deleteTx(id: string) {
    const next = all.filter((t) => t.id !== id);
    saveTransactions(next);
    setRefresh((v) => v + 1);
  }

  return (
    <div className="space-y-3">
      <Card className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border rounded px-2 py-2 text-sm"
            placeholder="Search notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="border rounded px-2 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select className="border rounded px-2 py-2 text-sm col-span-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-3">
        {filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">No transactions</div>
        ) : (
          <div className="space-y-2 text-sm">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.category}</div>
                  <div className="text-xs text-muted-foreground">{t.date}{t.note ? ` · ${t.note}` : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={t.type === "expense" ? "text-red-600" : "text-green-600"}>
                    {t.type === "expense" ? "-" : "+"}{formatINR(t.amount)}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => deleteTx(t.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}



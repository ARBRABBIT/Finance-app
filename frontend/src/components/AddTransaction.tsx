"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { loadCategories, addLocalTransaction, TransactionType } from "@/lib/store";
import { toast } from "sonner";

type Props = {
  onAdded?: () => void;
};

export default function AddTransaction({ onAdded }: Props) {
  const categories = useMemo(() => loadCategories(), []);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);
  const [category, setCategory] = useState<string>(categories[0] || "Other");
  const [note, setNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSubmitting(true);
    try {
      addLocalTransaction({ type, amount: parsed, date, category, note });
      toast.success("Added");
      setAmount("");
      setNote("");
      onAdded?.();
    } catch (err) {
      toast.error("Could not add transaction");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-3">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 text-sm">
        <select
          className="border rounded px-2 py-2 col-span-2"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          className="border rounded px-2 py-2"
          type="number"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border rounded px-2 py-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="border rounded px-2 py-2 col-span-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-2 col-span-2"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button className="col-span-2 py-2" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Card>
  );
}



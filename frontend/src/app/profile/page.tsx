"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  loadBudgetAmount,
  saveBudgetAmount,
  loadCategories,
  setCategories,
} from "@/lib/store";
import { toast } from "sonner";

export default function ProfilePage() {
  const [budget, setBudget] = useState<string>("");
  const [categoriesInput, setCategoriesInput] = useState<string>("");
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // Only read from localStorage after mount
    setBudget(String(loadBudgetAmount() || ""));
    setCategoriesInput(loadCategories().join(", "));
    try {
      const t = localStorage.getItem("theme");
      setTheme(t === "dark" ? "dark" : "light");
    } catch {}
  }, []);

  function handleSaveBudget() {
    const value = Number(budget);
    if (!Number.isFinite(value) || value < 0) {
      toast.error("Enter a valid budget amount");
      return;
    }
    saveBudgetAmount(value);
    toast.success("Budget saved");
  }

  function handleSaveCategories() {
    const list = categoriesInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (list.length === 0) {
      toast.error("Add at least one category");
      return;
    }
    setCategories(list);
    toast.success("Categories saved");
  }

  function handleExport() {
    try {
      const data = localStorage.getItem("transactions") || "[]";
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-export-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const contents = String(reader.result || "[]");
        JSON.parse(contents);
        localStorage.setItem("transactions", contents);
        toast.success("Imported transactions");
      } catch {
        toast.error("Invalid file");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-3">
      <Card className="p-3 space-y-2">
        <div className="text-sm font-medium">Monthly Budget</div>
        <div className="flex gap-2">
          <input
            className="border rounded px-2 py-2 text-sm flex-1"
            type="number"
            inputMode="decimal"
            placeholder="Enter amount"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <Button onClick={handleSaveBudget}>Save</Button>
        </div>
      </Card>

      <Card className="p-3 space-y-2">
        <div className="text-sm font-medium">Categories</div>
        <textarea
          className="border rounded px-2 py-2 text-sm w-full h-24"
          placeholder="Comma-separated (e.g., Food, Transport, Salary)"
          value={categoriesInput}
          onChange={(e) => setCategoriesInput(e.target.value)}
        />
        <div>
          <Button onClick={handleSaveCategories}>Save</Button>
        </div>
      </Card>

      <Card className="p-3 space-y-2">
        <div className="text-sm font-medium">Appearance</div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-2 text-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              try {
                localStorage.setItem("theme", theme);
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
                toast.success("Theme updated");
              } catch {
                toast.error("Could not update theme");
              }
            }}
          >
            Apply
          </Button>
        </div>
      </Card>

      <Card className="p-3 space-y-2">
        <div className="text-sm font-medium">Import / Export</div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline">Export JSON</Button>
          <label className="border rounded px-3 py-2 text-sm cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </Card>
    </div>
  );
}



"use client";

import AddTransaction from "@/components/AddTransaction";
import { Card } from "@/components/ui/card";

export default function AddPage() {
  return (
    <div className="space-y-3">
      <Card className="p-3">
        <div className="text-sm font-medium mb-2">Add Transaction</div>
        <AddTransaction />
      </Card>
    </div>
  );
}



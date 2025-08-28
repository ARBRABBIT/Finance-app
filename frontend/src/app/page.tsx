import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">This Month</div>
          <div className="text-2xl font-semibold">$0</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Budget Left</div>
          <div className="text-2xl font-semibold">$0</div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button className="py-6">Add Expense</Button>
        <Button variant="secondary" className="py-6">Add Income</Button>
      </div>
      <Card className="p-3">
        <div className="text-sm font-medium mb-2">Recent Activity</div>
        <div className="text-sm text-muted-foreground">No transactions yet.</div>
      </Card>
    </div>
  );
}

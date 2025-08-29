export type TransactionType = "expense" | "income";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  note?: string;
  createdAt: string; // ISO
};

const TRANSACTIONS_KEY = "transactions";
const BUDGET_KEY = "budget_amount";
const CATEGORIES_KEY = "categories";

const defaultCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Salary",
  "Other",
];

function getSafeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const testKey = "__test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadTransactions(): Transaction[] {
  const storage = getSafeStorage();
  if (!storage) return [];
  const raw = storage.getItem(TRANSACTIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  const storage = getSafeStorage();
  if (!storage) return;
  storage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addLocalTransaction(newTx: Omit<Transaction, "id" | "createdAt">): Transaction {
  const transactions = loadTransactions();
  const tx: Transaction = {
    ...newTx,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(tx);
  saveTransactions(transactions);
  return tx;
}

export function loadBudgetAmount(): number {
  const storage = getSafeStorage();
  if (!storage) return 0;
  const raw = storage.getItem(BUDGET_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export function saveBudgetAmount(amount: number): void {
  const storage = getSafeStorage();
  if (!storage) return;
  storage.setItem(BUDGET_KEY, String(Math.max(0, amount)));
}

export function loadCategories(): string[] {
  const storage = getSafeStorage();
  if (!storage) return defaultCategories;
  const raw = storage.getItem(CATEGORIES_KEY);
  if (!raw) return defaultCategories;
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

export function setCategories(categories: string[]): void {
  const storage = getSafeStorage();
  if (!storage) return;
  storage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function getCurrentMonthTotals(transactions: Transaction[]): { income: number; expenses: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let income = 0;
  let expenses = 0;
  for (const tx of transactions) {
    const d = new Date(tx.date);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    if (tx.type === "income") income += tx.amount;
    if (tx.type === "expense") expenses += tx.amount;
  }
  return { income, expenses };
}

export function deleteTransactionById(id: string): void {
  const all = loadTransactions();
  const next = all.filter((t) => t.id !== id);
  saveTransactions(next);
}

export function upsertTransaction(updated: Transaction): void {
  const all = loadTransactions();
  const index = all.findIndex((t) => t.id === updated.id);
  if (index >= 0) {
    all[index] = updated;
  } else {
    all.unshift(updated);
  }
  saveTransactions(all);
}

export function importTransactions(rawJson: string): boolean {
  try {
    const data = JSON.parse(rawJson) as Transaction[];
    if (!Array.isArray(data)) return false;
    saveTransactions(data);
    return true;
  } catch {
    return false;
  }
}

export function exportTransactions(): string {
  const all = loadTransactions();
  return JSON.stringify(all, null, 2);
}



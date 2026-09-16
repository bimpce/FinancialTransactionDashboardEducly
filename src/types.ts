export type TransactionType = 'Income' | 'Expense';

export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Transportation'
  | 'Leisure'
  | 'Entertainment'
  | 'Health'
  | 'Housing'
  | 'Other'
  | string;

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  accumulatedBalance?: number | null;
}

export interface KPIStats {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  savingsRate: number; // Percentage, e.g. 56.6
  incomeCount: number;
  expenseCount: number;
}

export interface MonthlyComparison {
  monthKey: string;
  monthLabel: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

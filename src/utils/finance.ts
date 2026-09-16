import {
  Transaction,
  KPIStats,
  MonthlyComparison,
  CategoryBreakdown,
} from '../types';

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#8b5cf6', // Violet
  Transportation: '#a855f7', // Purple
  Transport: '#a855f7',
  Food: '#ec4899', // Pink
  Entertainment: '#c084fc', // Light Purple
  Leisure: '#c084fc',
  Health: '#06b6d4', // Cyan
  Other: '#6366f1', // Indigo
};

export const DEFAULT_CATEGORY_COLOR = '#94a3b8';

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || DEFAULT_CATEGORY_COLOR;
}

export function formatCurrency(value: number, showSign = false): string {
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const formatted = absVal.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (showSign) {
    if (isNegative) return `-${formatted}`;
    if (value > 0) return `+${formatted}`;
  }
  return isNegative ? `-${formatted}` : formatted;
}

export function formatDate(dateString: string): string {
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function calculateKPIStats(transactions: Transaction[]): KPIStats {
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const t of transactions) {
    if (t.type === 'Income') {
      totalIncome += t.amount;
      incomeCount++;
    } else {
      totalExpenses += t.amount;
      expenseCount++;
    }
  }

  const currentBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    currentBalance,
    savingsRate: Number(savingsRate.toFixed(1)),
    incomeCount,
    expenseCount,
  };
}

export function calculateMonthlyComparison(
  transactions: Transaction[]
): MonthlyComparison[] {
  const map = new Map<string, { income: number; expenses: number }>();

  for (const t of transactions) {
    // Extract YYYY-MM
    const key = t.date ? t.date.substring(0, 7) : 'Unknown';
    if (!map.has(key)) {
      map.set(key, { income: 0, expenses: 0 });
    }
    const current = map.get(key)!;
    if (t.type === 'Income') {
      current.income += t.amount;
    } else {
      current.expenses += t.amount;
    }
  }

  const sortedKeys = Array.from(map.keys()).sort();

  return sortedKeys.map((key) => {
    let monthLabel = key;
    try {
      const [year, month] = key.split('-');
      if (year && month) {
        const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
        monthLabel = d.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      monthLabel = key;
    }

    const { income, expenses } = map.get(key)!;
    return {
      monthKey: key,
      monthLabel,
      income: Number(income.toFixed(2)),
      expenses: Number(expenses.toFixed(2)),
      net: Number((income - expenses).toFixed(2)),
    };
  });
}

export function calculateCategoryBreakdown(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const map = new Map<string, { amount: number; count: number }>();
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'Expense') {
      totalExpenses += t.amount;
      const cat = t.category || 'Other';
      if (!map.has(cat)) {
        map.set(cat, { amount: 0, count: 0 });
      }
      const item = map.get(cat)!;
      item.amount += t.amount;
      item.count += 1;
    }
  }

  if (totalExpenses === 0) return [];

  const breakdown: CategoryBreakdown[] = [];
  map.forEach((value, category) => {
    const percentage = Number(((value.amount / totalExpenses) * 100).toFixed(1));
    breakdown.push({
      category,
      amount: Number(value.amount.toFixed(2)),
      percentage,
      count: value.count,
      color: getCategoryColor(category),
    });
  });

  // Sort largest expense first
  return breakdown.sort((a, b) => b.amount - a.amount);
}

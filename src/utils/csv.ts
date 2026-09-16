import { Transaction } from '../types';

export const RAW_SAMPLE_CSV = `Date,Description,Category,Type,Value,Accumulated Balance
2026-05-01,Monthly salary,Other,Income,"3,200.00",,"3,200.00"
2026-05-02,Apartment rent,Housing,Expense,"1,200.00","-1,200.00"
2026-05-03,Supermarket weekly groceries,Food,Expense,96.45,"-1,296.45"
2026-05-04,Bus pass recharge,Transportation,Expense,48.00,"-1,344.45"
2026-05-06,Dinner with friends,Entertainment,Expense,42.80,"-1,387.25"
2026-05-08,Pharmacy vitamins,Health,Expense,18.60,"-1,405.85"
2026-05-10,Freelance website update,Other,Income,450.00,-955.85
2026-05-11,Coffee and breakfast,Food,Expense,11.90,-967.75
2026-05-13,Fuel refill,Transportation,Expense,67.20,"-1,034.95"
2026-05-15,Movie tickets,Entertainment,Expense,24.00,"-1,058.95"
2026-05-18,Doctor copay,Health,Expense,35.00,"-1,093.95"
2026-05-20,Electricity bill,Housing,Expense,89.30,"-1,183.25"
2026-05-23,Lunch at work,Food,Expense,14.50,"-1,197.75"
2026-05-26,Streaming subscription,Entertainment,Expense,12.99,"-1,210.74"
2026-05-28,Sold old monitor,Other,Income,180.00,"-1,030.74"`;

/**
 * Split CSV line taking quotes with internal commas into account
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parse CSV string into Transaction objects
 */
export function parseCSV(csvText: string): Transaction[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('[') && !l.endsWith(']'));

  if (lines.length === 0) return [];

  // Parse header
  const headerTokens = parseCSVLine(lines[0]).map((t) => t.toLowerCase());

  const dateIdx = headerTokens.findIndex((t) => t.includes('date'));
  const descIdx = headerTokens.findIndex((t) => t.includes('desc'));
  const catIdx = headerTokens.findIndex((t) => t.includes('cat'));
  const typeIdx = headerTokens.findIndex((t) => t.includes('type'));
  const valueIdx = headerTokens.findIndex(
    (t) => t.includes('value') || t.includes('amount')
  );
  const balIdx = headerTokens.findIndex((t) => t.includes('balance'));

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].replace(/[\]]$/, ''); // strip possible trailing bracket
    const cols = parseCSVLine(rawLine);
    if (cols.length < 3) continue;

    const rawDate = (dateIdx >= 0 ? cols[dateIdx] : cols[0]) || '';
    const rawDesc = (descIdx >= 0 ? cols[descIdx] : cols[1]) || 'Transaction';
    const rawCat = (catIdx >= 0 ? cols[catIdx] : cols[2]) || 'Other';
    const rawType = (typeIdx >= 0 ? cols[typeIdx] : cols[3]) || 'Expense';
    const rawVal = (valueIdx >= 0 ? cols[valueIdx] : cols[4]) || '0';
    const rawBal = balIdx >= 0 ? cols[balIdx] : cols[5];

    // Clean number values
    const cleanAmountStr = rawVal.replace(/[^0-9.-]/g, '');
    let amount = parseFloat(cleanAmountStr);
    if (isNaN(amount)) amount = 0;
    amount = Math.abs(amount);

    let cleanType: 'Income' | 'Expense' = 'Expense';
    if (/income/i.test(rawType) || /credit/i.test(rawType) || /deposit/i.test(rawType)) {
      cleanType = 'Income';
    } else {
      cleanType = 'Expense';
    }

    let accumulatedBalance: number | null = null;
    if (rawBal !== undefined && rawBal !== '') {
      const cleanBalStr = rawBal.replace(/[^0-9.-]/g, '');
      const parsedBal = parseFloat(cleanBalStr);
      if (!isNaN(parsedBal)) {
        accumulatedBalance = parsedBal;
      }
    }

    // Standardize Category names
    let category = rawCat.trim();
    if (/transport/i.test(category)) category = 'Transportation';
    else if (/entertain/i.test(category) || /leisure/i.test(category)) category = 'Entertainment';
    else if (/food/i.test(category) || /grocer/i.test(category)) category = 'Food';
    else if (/health/i.test(category) || /medic/i.test(category)) category = 'Health';
    else if (/house|housing|rent|utilit/i.test(category)) category = 'Housing';
    else if (!category) category = 'Other';

    transactions.push({
      id: `tx-${i}-${Date.now().toString(36)}`,
      date: rawDate.trim(),
      description: rawDesc.trim(),
      category,
      type: cleanType,
      amount,
      accumulatedBalance,
    });
  }

  return transactions;
}

/**
 * Export transactions back to CSV string
 */
export function exportToCSV(transactions: Transaction[]): string {
  const header = 'Date,Description,Category,Type,Value,Accumulated Balance';
  const rows = transactions.map((t) => {
    const formattedVal = t.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const balanceStr =
      t.accumulatedBalance !== null && t.accumulatedBalance !== undefined
        ? `"${t.accumulatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}"`
        : '';
    return `${t.date},"${t.description.replace(/"/g, '""')}",${t.category},${t.type},"${formattedVal}",${balanceStr}`;
  });

  return [header, ...rows].join('\n');
}

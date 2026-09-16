import React, { useState, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Calendar,
  Layers,
  FileText,
  Clock,
} from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/finance';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyTen, setShowOnlyTen] = useState(true);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Sort by date descending (most recent first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      return 0;
    });
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.date.includes(searchQuery);

      const matchesType =
        selectedType === 'All' || t.type === selectedType;

      const matchesCategory =
        selectedCategory === 'All' || t.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [sortedTransactions, searchQuery, selectedType, selectedCategory]);

  // Apply "10 most recent" constraint or show all
  const displayedTransactions = useMemo(() => {
    if (showOnlyTen) {
      return filteredTransactions.slice(0, 10);
    }
    return filteredTransactions;
  }, [filteredTransactions, showOnlyTen]);

  return (
    <div
      id="recent-transactions-container"
      className="rounded-xl bg-zinc-900/80 border border-zinc-800/90 shadow-lg overflow-hidden"
    >
      {/* Header with Title and Controls */}
      <div className="p-5 border-b border-zinc-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-white">
                Recent Transactions
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {showOnlyTen
                ? 'Showing the 10 most recent entries in chronological order'
                : `Showing all ${filteredTransactions.length} entries`}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56 min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="search-transactions-input"
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Type Filter */}
            <div className="inline-flex bg-zinc-950/70 p-0.5 rounded-lg border border-zinc-800 text-xs">
              {(['All', 'Income', 'Expense'] as const).map((type) => (
                <button
                  key={type}
                  id={`filter-type-${type.toLowerCase()}`}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    selectedType === type
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-950/60 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* 10 Recent vs All toggle */}
            <button
              id="toggle-10-recent"
              type="button"
              onClick={() => setShowOnlyTen(!showOnlyTen)}
              className="px-2.5 py-1.5 rounded-lg border border-purple-900/40 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 text-xs font-medium transition-colors"
            >
              {showOnlyTen ? 'View All' : 'Show Top 10'}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {displayedTransactions.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400 font-medium">No transactions found</p>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search query or filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/60 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800/80">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Date
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Description
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Type
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Amount
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Balance (CSV)
                  </th>
                  {onDeleteTransaction && (
                    <th scope="col" className="py-3 px-4 text-center">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {displayedTransactions.map((tx) => {
                  const isIncome = tx.type === 'Income';
                  const catColor = getCategoryColor(tx.category);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                            borderColor: `${catColor}33`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: catColor }}
                          />
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                            isIncome
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                              : 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-semibold whitespace-nowrap ${
                          isIncome ? 'text-emerald-400' : 'text-zinc-200'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-zinc-400 whitespace-nowrap">
                        {tx.accumulatedBalance !== null &&
                        tx.accumulatedBalance !== undefined
                          ? formatCurrency(tx.accumulatedBalance)
                          : '—'}
                      </td>
                      {onDeleteTransaction && (
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(tx.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 text-[11px] transition-opacity p-1"
                            title="Remove transaction"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-zinc-800/60">
            {displayedTransactions.map((tx) => {
              const isIncome = tx.type === 'Income';
              const catColor = getCategoryColor(tx.category);

              return (
                <div key={tx.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate">
                        {tx.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {formatDate(tx.date)}
                        </span>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                            borderColor: `${catColor}33`,
                          }}
                        >
                          {tx.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-sm font-mono font-bold ${
                          isIncome ? 'text-emerald-400' : 'text-zinc-200'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium ${
                            isIncome
                              ? 'bg-emerald-950/60 text-emerald-300'
                              : 'bg-rose-950/60 text-rose-300'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer info */}
      <div className="p-3 bg-zinc-950/40 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 px-4">
        <span>
          Showing {displayedTransactions.length} of {filteredTransactions.length}{' '}
          entries
        </span>
        {showOnlyTen && filteredTransactions.length > 10 && (
          <button
            type="button"
            onClick={() => setShowOnlyTen(false)}
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium text-xs"
          >
            Show all {filteredTransactions.length} transactions →
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { Transaction, TransactionCategory, TransactionType } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Health',
  'Housing',
  'Other',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [date, setDate] = useState('2026-05-30');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [type, setType] = useState<TransactionType>('Expense');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    onAddTransaction({
      date,
      description: description.trim(),
      category,
      type,
      amount: parsedAmount,
    });

    // Reset
    setDescription('');
    setAmount('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-900 border border-purple-800/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Add New Transaction
              </h3>
              <p className="text-xs text-zinc-400">
                Record a new income or expense entry
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-zinc-400 font-medium mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setType('Expense')}
                className={`py-2 rounded-lg font-medium transition-all ${
                  type === 'Expense'
                    ? 'bg-rose-900/60 text-rose-200 border border-rose-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('Income')}
                className={`py-2 rounded-lg font-medium transition-all ${
                  type === 'Income'
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery shopping, Freelance design"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Amount & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md transition-colors"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

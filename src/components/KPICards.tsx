import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, PiggyBank, TrendingUp, CheckCircle2 } from 'lucide-react';
import { KPIStats } from '../types';
import { formatCurrency } from '../utils/finance';

interface KPICardsProps {
  stats: KPIStats;
}

export const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  const isPositiveBalance = stats.currentBalance >= 0;
  const isGoodSavingsRate = stats.savingsRate >= 20;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Income */}
      <div
        id="kpi-card-income"
        className="relative overflow-hidden rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 shadow-lg hover:border-purple-500/40 transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {formatCurrency(stats.totalIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              +{stats.incomeCount} credits
            </span>
            <span>recorded</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/40" />
      </div>

      {/* 2. Total Expenses */}
      <div
        id="kpi-card-expenses"
        className="relative overflow-hidden rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 shadow-lg hover:border-purple-500/40 transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {formatCurrency(stats.totalExpenses)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-rose-950/60 text-rose-300 border border-rose-800/40">
              {stats.expenseCount} debits
            </span>
            <span>recorded</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500/40" />
      </div>

      {/* 3. Current Balance */}
      <div
        id="kpi-card-balance"
        className="relative overflow-hidden rounded-xl bg-zinc-900/80 border border-purple-800/40 p-5 shadow-lg hover:border-purple-500/60 transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            Current Balance
          </span>
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isPositiveBalance ? 'text-purple-200' : 'text-rose-400'
            }`}
          >
            {formatCurrency(stats.currentBalance, true)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                isPositiveBalance
                  ? 'bg-purple-950/70 text-purple-300 border border-purple-700/50'
                  : 'bg-rose-950/70 text-rose-300 border border-rose-700/50'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              {isPositiveBalance ? 'Net Positive' : 'Deficit'}
            </span>
            <span>Net cashflow</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
      </div>

      {/* 4. Savings Rate % */}
      <div
        id="kpi-card-savings-rate"
        className="relative overflow-hidden rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 shadow-lg hover:border-purple-500/40 transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Savings Rate %
          </span>
          <div className="w-9 h-9 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover:scale-105 transition-transform">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {stats.savingsRate}%
            </span>
            <span className="text-xs text-zinc-500">of income</span>
          </div>
          <div className="mt-2.5">
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(stats.savingsRate, 0), 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                {isGoodSavingsRate && (
                  <CheckCircle2 className="w-3 h-3 text-purple-400 inline" />
                )}
                {isGoodSavingsRate ? 'Above 20% benchmark' : 'Below benchmark'}
              </span>
              <span className="text-purple-400/80 font-medium">Target 20%+</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-500/40" />
      </div>
    </div>
  );
};

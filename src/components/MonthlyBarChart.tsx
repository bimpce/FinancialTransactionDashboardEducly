import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyComparison } from '../types';
import { formatCurrency } from '../utils/finance';
import { BarChart3, TrendingUp } from 'lucide-react';

interface MonthlyBarChartProps {
  data: MonthlyComparison[];
  includeHistorical: boolean;
  onToggleHistorical: (val: boolean) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const incomeVal =
      payload.find((p) => p.name === 'Income')?.value || 0;
    const expenseVal =
      payload.find((p) => p.name === 'Expenses')?.value || 0;
    const netVal = incomeVal - expenseVal;

    return (
      <div className="rounded-lg bg-zinc-900/95 border border-purple-800/40 p-3 shadow-xl backdrop-blur-md min-w-[180px]">
        <div className="font-semibold text-zinc-200 text-sm border-b border-zinc-800 pb-1.5 mb-2">
          {label}
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
              Income
            </span>
            <span className="font-mono font-medium text-purple-200">
              {formatCurrency(incomeVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              Expenses
            </span>
            <span className="font-mono font-medium text-rose-200">
              {formatCurrency(expenseVal)}
            </span>
          </div>
          <div className="border-t border-zinc-800 pt-1.5 mt-1 flex items-center justify-between font-medium">
            <span className="text-zinc-400">Net Flow</span>
            <span
              className={`font-mono ${
                netVal >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(netVal, true)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  data,
  includeHistorical,
  onToggleHistorical,
}) => {
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `$${(tickItem / 1000).toFixed(1)}k`;
    }
    return `$${tickItem}`;
  };

  return (
    <div
      id="monthly-bar-chart-card"
      className="flex flex-col h-full rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Income vs Expenses by Month
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Side-by-side monthly cash flow comparison
          </p>
        </div>

        {/* Multi-month comparison toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            id="toggle-multi-month"
            onClick={() => onToggleHistorical(!includeHistorical)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              includeHistorical
                ? 'bg-purple-950/70 border-purple-600 text-purple-200'
                : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title="Toggle previous months trend"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{includeHistorical ? 'Multi-Month Trend (Mar–May)' : 'Current Period Only'}</span>
          </button>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72 min-h-[260px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            No transaction data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              barGap={6}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="monthLabel"
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(168, 85, 247, 0.05)' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 12, fontSize: 12, color: '#a1a1aa' }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Expenses</span>
          </div>
        </div>
        <span className="text-zinc-500 text-[11px]">
          {data.length} {data.length === 1 ? 'month' : 'months'} visualized
        </span>
      </div>
    </div>
  );
};

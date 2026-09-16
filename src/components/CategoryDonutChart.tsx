import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBreakdown } from '../types';
import { formatCurrency } from '../utils/finance';
import { PieChart as PieIcon, Layers } from 'lucide-react';

interface CategoryDonutChartProps {
  breakdown: CategoryBreakdown[];
  totalExpenses: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CategoryBreakdown;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg bg-zinc-900/95 border border-purple-800/40 p-3 shadow-xl backdrop-blur-md min-w-[160px]">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-zinc-200 text-sm">
            {data.category}
          </span>
        </div>
        <div className="text-xs space-y-1">
          <div className="flex justify-between text-zinc-300">
            <span className="text-zinc-400">Amount:</span>
            <span className="font-mono font-medium text-white">
              {formatCurrency(data.amount)}
            </span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span className="text-zinc-400">Share:</span>
            <span className="font-mono font-medium text-purple-300">
              {data.percentage}%
            </span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[11px] pt-1 border-t border-zinc-800">
            <span>Transactions:</span>
            <span>{data.count}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  breakdown,
  totalExpenses,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryBreakdown | null>(
    null
  );

  return (
    <div
      id="category-donut-chart-card"
      className="flex flex-col h-full rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Expense Breakdown by Category
            </h2>
            <p className="text-xs text-zinc-400">
              Distribution of spending across categories
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-500">
          <Layers className="w-3.5 h-3.5" />
          <span>{breakdown.length} Categories</span>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm min-h-[260px]">
          No expense records available
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          {/* Donut graphic with center stats */}
          <div className="relative w-full md:w-1/2 h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={breakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="#18181b"
                  strokeWidth={2}
                  onMouseEnter={(_, index) => setActiveCategory(breakdown[index])}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                {activeCategory ? activeCategory.category : 'Total Spent'}
              </span>
              <span className="text-lg font-bold font-mono text-white mt-0.5">
                {formatCurrency(
                  activeCategory ? activeCategory.amount : totalExpenses
                )}
              </span>
              <span className="text-[11px] text-purple-400 font-medium">
                {activeCategory
                  ? `${activeCategory.percentage}% of total`
                  : `${breakdown.reduce((acc, c) => acc + c.count, 0)} expenses`}
              </span>
            </div>
          </div>

          {/* Category Legend & Percentages */}
          <div className="w-full md:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
            {breakdown.map((item) => {
              const isHovered =
                activeCategory?.category === item.category;

              return (
                <div
                  key={item.category}
                  onMouseEnter={() => setActiveCategory(item)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer border ${
                    isHovered
                      ? 'bg-zinc-800/80 border-purple-500/40'
                      : 'bg-zinc-950/40 border-zinc-800/60 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-medium text-zinc-200 truncate">
                        {item.category}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="text-xs font-mono font-semibold text-zinc-100">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-[10px] font-mono text-purple-400 font-medium">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

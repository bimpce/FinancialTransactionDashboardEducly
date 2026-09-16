import React, { useState, useMemo } from 'react';
import { Transaction } from './types';
import {
  RAW_SAMPLE_CSV,
  parseCSV,
  exportToCSV,
} from './utils/csv';
import { HISTORICAL_TRANSACTIONS } from './data/mockMultiMonth';
import {
  calculateKPIStats,
  calculateMonthlyComparison,
  calculateCategoryBreakdown,
} from './utils/finance';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { MonthlyBarChart } from './components/MonthlyBarChart';
import { CategoryDonutChart } from './components/CategoryDonutChart';
import { RecentTransactionsTable } from './components/RecentTransactionsTable';
import { CSVModal } from './components/CSVModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { UpdateDataPage } from './components/UpdateDataPage';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CheckCircle2, X, Loader2 } from 'lucide-react';

function DashboardApp() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<'dashboard' | 'update-data'>('dashboard');
  const [csvText, setCsvText] = useState<string>(RAW_SAMPLE_CSV);
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    parseCSV(RAW_SAMPLE_CSV)
  );
  const [includeHistoricalMonths, setIncludeHistoricalMonths] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<{
    message: string;
    recordCount: number;
  } | null>(null);

  // If auth is verifying session, show clean dark purple loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-300">
        <Loader2 className="w-9 h-9 text-purple-500 animate-spin mb-3" />
        <span className="text-xs text-zinc-400 font-medium">Checking authentication...</span>
      </div>
    );
  }

  // If user is not authenticated, render Login Page (route protection)
  if (!user) {
    return <LoginPage />;
  }

  // Detect whether data differs from initial default
  const isModified = csvText !== RAW_SAMPLE_CSV || transactions.length !== 15;

  // Combined transactions for monthly chart if historical trend is toggled on
  const monthlyTransactions = includeHistoricalMonths
    ? [...HISTORICAL_TRANSACTIONS, ...transactions]
    : transactions;

  // Financial metrics
  const stats = calculateKPIStats(transactions);
  const monthlyData = calculateMonthlyComparison(monthlyTransactions);
  const categoryBreakdown = calculateCategoryBreakdown(transactions);

  // Replace data handler from Update Data page
  const handleDataReplaced = (
    newTransactions: Transaction[],
    newCsvText: string,
    recordCount: number,
    filename?: string
  ) => {
    setTransactions(newTransactions);
    setCsvText(newCsvText);
    setSuccessBanner({
      message: filename
        ? `Successfully replaced data with "${filename}". Loaded ${recordCount} records.`
        : `Successfully loaded ${recordCount} records into the dashboard!`,
      recordCount,
    });
  };

  const handleApplyCSV = (newCsvText: string) => {
    const parsed = parseCSV(newCsvText);
    setTransactions(parsed);
    setCsvText(newCsvText);
    setSuccessBanner({
      message: `Successfully loaded ${parsed.length} records!`,
      recordCount: parsed.length,
    });
  };

  const handleResetDefault = () => {
    const defaultParsed = parseCSV(RAW_SAMPLE_CSV);
    setTransactions(defaultParsed);
    setCsvText(RAW_SAMPLE_CSV);
    setIncludeHistoricalMonths(false);
    setSuccessBanner(null);
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const createdTx: Transaction = {
      ...newTx,
      id: `tx-user-${Date.now()}`,
    };
    const updated = [createdTx, ...transactions];
    setTransactions(updated);
    setCsvText(exportToCSV(updated));
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    setCsvText(exportToCSV(updated));
  };

  const handleExportCSV = () => {
    const content = exportToCSV(transactions);
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Top Navigation with Logout Button */}
      <Header
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetDefault}
        isModified={isModified}
        transactionCount={transactions.length}
      />

      {/* Persistent Success Banner on Dashboard */}
      {successBanner && activePage === 'dashboard' && (
        <div className="bg-purple-950/60 border-b border-purple-800/50 py-2.5 px-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong className="font-semibold text-white">Dashboard Updated:</strong>{' '}
                {successBanner.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner(null)}
              className="text-zinc-400 hover:text-white p-1"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Dashboard or Update Data Page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activePage === 'dashboard' ? (
          <>
            {/* Section 1: 4 KPI Cards */}
            <section aria-label="Key Performance Indicators">
              <KPICards stats={stats} />
            </section>

            {/* Section 2: Visual Charts (Bar Chart & Category Donut) */}
            <section
              aria-label="Financial Visualizations"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Monthly Comparison Bar Chart */}
              <div className="lg:col-span-7 flex flex-col">
                <MonthlyBarChart
                  data={monthlyData}
                  includeHistorical={includeHistoricalMonths}
                  onToggleHistorical={setIncludeHistoricalMonths}
                />
              </div>

              {/* Category Donut Chart */}
              <div className="lg:col-span-5 flex flex-col">
                <CategoryDonutChart
                  breakdown={categoryBreakdown}
                  totalExpenses={stats.totalExpenses}
                />
              </div>
            </section>

            {/* Section 3: 10 Most Recent Transactions Table */}
            <section aria-label="Transaction Records">
              <RecentTransactionsTable
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </section>
          </>
        ) : (
          /* Update Data Page */
          <UpdateDataPage
            onDataReplaced={handleDataReplaced}
            onNavigateToDashboard={() => setActivePage('dashboard')}
            currentRecordCount={transactions.length}
            onResetDefault={handleResetDefault}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Financial Transaction Dashboard &bull; Dark Theme &bull; Purple Accents</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActivePage('dashboard')}
              className={`hover:text-purple-400 transition-colors ${
                activePage === 'dashboard' ? 'text-purple-400 font-medium' : ''
              }`}
            >
              Dashboard
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setActivePage('update-data')}
              className={`hover:text-purple-400 transition-colors ${
                activePage === 'update-data' ? 'text-purple-400 font-medium' : ''
              }`}
            >
              Update Data
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        currentCSVText={csvText}
        onApplyCSV={handleApplyCSV}
        onResetDefault={handleResetDefault}
      />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardApp />
    </AuthProvider>
  );
}

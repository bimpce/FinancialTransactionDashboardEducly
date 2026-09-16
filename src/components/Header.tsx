import React from 'react';
import {
  Wallet,
  Plus,
  FileSpreadsheet,
  Download,
  RotateCcw,
  LayoutDashboard,
  UploadCloud,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activePage: 'dashboard' | 'update-data';
  onNavigate: (page: 'dashboard' | 'update-data') => void;
  onOpenAddModal: () => void;
  onOpenCSVModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  isModified: boolean;
  transactionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onOpenAddModal,
  onOpenCSVModal,
  onExportCSV,
  onResetData,
  isModified,
  transactionCount,
}) => {
  const { user, signOut } = useAuth();

  return (
    <header
      id="dashboard-header"
      className="border-b border-purple-900/30 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Brand & Navigation Links */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Logo & Title */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    Financial Dashboard
                  </h1>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {transactionCount} records loaded &middot; Dark Theme
                </p>
              </div>
            </div>

            {/* Navigation Link between Dashboard & Update Data */}
            <nav
              aria-label="Main Navigation"
              className="inline-flex items-center bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl text-xs self-start sm:self-auto"
            >
              <button
                type="button"
                id="nav-dashboard-link"
                onClick={() => onNavigate('dashboard')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activePage === 'dashboard'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                id="nav-update-data-link"
                onClick={() => onNavigate('update-data')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activePage === 'update-data'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Update Data</span>
              </button>
            </nav>
          </div>

          {/* Right: Quick Action buttons + User Profile & Logout */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {isModified && (
              <button
                type="button"
                id="header-reset-btn"
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/70 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
                title="Reset to default prompt dataset"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden xl:inline">Reset</span>
              </button>
            )}

            <button
              type="button"
              id="header-csv-btn"
              onClick={onOpenCSVModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-purple-900/40 text-purple-300 hover:bg-purple-950/40 text-xs font-medium transition-colors"
              title="Inspect or raw edit CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV Raw</span>
            </button>

            <button
              type="button"
              id="header-export-btn"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
              title="Download updated CSV file"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              type="button"
              id="header-add-transaction-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>

            {/* User Badge & Logout in the top corner of every page */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-zinc-800">
              {user?.email && (
                <div
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800/80 text-[11px] text-zinc-300 max-w-[160px] truncate"
                  title={user.email}
                >
                  <UserIcon className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}

              <button
                type="button"
                id="header-logout-btn"
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-800/60 text-zinc-300 hover:text-rose-300 hover:bg-rose-950/30 text-xs font-medium transition-all shadow-sm"
                title="Log out of the dashboard"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

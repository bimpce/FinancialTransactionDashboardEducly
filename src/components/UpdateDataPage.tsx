import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Info,
  Layers,
  FileCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Transaction } from '../types';
import { parseCSV, RAW_SAMPLE_CSV, exportToCSV } from '../utils/csv';
import { formatCurrency, formatDate } from '../utils/finance';

interface UpdateDataPageProps {
  onDataReplaced: (newTransactions: Transaction[], newCsvText: string, recordCount: number, filename?: string) => void;
  onNavigateToDashboard: () => void;
  currentRecordCount: number;
  onResetDefault: () => void;
}

export const UpdateDataPage: React.FC<UpdateDataPageProps> = ({
  onDataReplaced,
  onNavigateToDashboard,
  currentRecordCount,
  onResetDefault,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadedInfo, setLastUploadedInfo] = useState<{
    filename: string;
    recordCount: number;
    totalIncome: number;
    totalExpenses: number;
    samplePreview: Transaction[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSVContent = (content: string, filename = 'custom_data.csv') => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const parsed = parseCSV(content);

      if (parsed.length === 0) {
        setErrorMessage(
          'No valid transactions were found in the uploaded file. Please ensure it follows the format: Date, Description, Category, Type, Amount.'
        );
        setIsProcessing(false);
        return;
      }

      let income = 0;
      let expenses = 0;
      parsed.forEach((t) => {
        if (t.type === 'Income') income += t.amount;
        else expenses += t.amount;
      });

      setLastUploadedInfo({
        filename,
        recordCount: parsed.length,
        totalIncome: income,
        totalExpenses: expenses,
        samplePreview: parsed.slice(0, 5),
      });

      // Replace current data and update dashboard
      onDataReplaced(parsed, content, parsed.length, filename);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        'An error occurred while reading the file. Please check that the file is a valid CSV text file.'
      );
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processCSVContent(text, file.name);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file.');
    };
    reader.readAsText(file);
    // Clear input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMessage('Please drop a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processCSVContent(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([RAW_SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transaction_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <UploadCloud className="w-5 h-5" />
            </span>
            Update Financial Data
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Upload a CSV file to replace current dashboard metrics and charts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="download-template-btn"
            onClick={downloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Success Notification Message */}
      {lastUploadedInfo && (
        <div
          id="upload-success-message"
          className="rounded-xl bg-purple-950/40 border border-purple-600/50 p-4 sm:p-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                  Upload Successful!
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900/60 text-purple-200 border border-purple-700/50">
                    {lastUploadedInfo.recordCount} records loaded
                  </span>
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Replaced previous dataset with <span className="text-purple-300 font-mono font-medium">{lastUploadedInfo.filename}</span>. Total Income:{' '}
                  <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(lastUploadedInfo.totalIncome)}</span> | Total Expenses:{' '}
                  <span className="font-mono text-rose-400 font-semibold">{formatCurrency(lastUploadedInfo.totalExpenses)}</span>.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="view-dashboard-after-upload"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/60 transition-all hover:scale-[1.02] flex-shrink-0"
            >
              <span>View Updated Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          id="upload-error-message"
          className="rounded-xl bg-rose-950/50 border border-rose-800/80 p-4 text-xs text-rose-200 flex items-start gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-white mb-0.5">Upload Failed</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Drag and Drop File Upload Area */}
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          id="csv-file-upload-input"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          id="csv-drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-purple-500 bg-purple-950/30 scale-[1.01]'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-purple-500/60 hover:bg-zinc-900/90'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 ${
                isDragging
                  ? 'bg-purple-600 text-white scale-110'
                  : 'bg-purple-600/10 border border-purple-500/30 text-purple-400'
              }`}
            >
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <div className="text-base font-semibold text-white">
                {isProcessing
                  ? 'Reading and processing CSV file...'
                  : isDragging
                  ? 'Drop your CSV file right here'
                  : 'Drag & drop your new CSV file here'}
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                or <span className="text-purple-400 font-semibold underline underline-offset-2">browse files</span> on your device. Supports UTF-8 encoded <span className="font-mono text-zinc-300">.csv</span> files.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 mt-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
              <span>Required columns: Date, Description, Category, Type, Amount</span>
            </div>
          </div>
        </div>
      </div>

      {/* Format Specification & Column Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expected Format */}
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Info className="w-4 h-4 text-purple-400" />
            <span>Expected File Format</span>
          </div>
          <p className="text-xs text-zinc-400">
            The CSV should have the following 5 columns in the header:
          </p>
          <ul className="text-xs space-y-2 text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-semibold">Date:</span>
              <span className="text-zinc-400">Transaction date (e.g. 2026-05-01)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-semibold">Description:</span>
              <span className="text-zinc-400">Title (e.g. Apartment rent, Salary)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-semibold">Category:</span>
              <span className="text-zinc-400">Food, Transportation, Leisure, Health, Housing, Other</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-semibold">Type:</span>
              <span className="text-zinc-400">"Income" or "Expense"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-semibold">Amount / Value:</span>
              <span className="text-zinc-400">Dollar value (e.g. "1,200.00" or 96.45)</span>
            </li>
          </ul>
        </div>

        {/* Current Data Status & Sample Snippet */}
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800/90 p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-white font-semibold text-sm">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span>Active Dataset Status</span>
              </div>
              <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                {currentRecordCount} records active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Currently loaded data will be replaced immediately upon uploading a new file.
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset to Default Sample CSV</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview of newly loaded records if available */}
      {lastUploadedInfo && lastUploadedInfo.samplePreview.length > 0 && (
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800/90 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">
                First {lastUploadedInfo.samplePreview.length} Records Preview
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">
              from {lastUploadedInfo.filename}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800/80">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {lastUploadedInfo.samplePreview.map((t, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30">
                    <td className="py-2.5 px-4 font-mono text-zinc-400">{formatDate(t.date)}</td>
                    <td className="py-2.5 px-4 font-medium text-white">{t.description}</td>
                    <td className="py-2.5 px-4 text-purple-300">{t.category}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          t.type === 'Income'
                            ? 'bg-emerald-950/60 text-emerald-300'
                            : 'bg-rose-950/60 text-rose-300'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-mono font-semibold ${
                        t.type === 'Income' ? 'text-emerald-400' : 'text-zinc-200'
                      }`}
                    >
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

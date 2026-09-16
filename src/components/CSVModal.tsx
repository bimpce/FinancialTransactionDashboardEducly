import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Check,
  Copy,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { RAW_SAMPLE_CSV } from '../utils/csv';

interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCSVText: string;
  onApplyCSV: (csvText: string) => void;
  onResetDefault: () => void;
}

export const CSVModal: React.FC<CSVModalProps> = ({
  isOpen,
  onClose,
  currentCSVText,
  onApplyCSV,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'inspect' | 'upload' | 'paste'>('inspect');
  const [pasteContent, setPasteContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCSVText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          onApplyCSV(content);
          onClose();
        } catch {
          setErrorMsg('Failed to parse uploaded CSV. Please check formatting.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPaste = () => {
    if (!pasteContent.trim()) {
      setErrorMsg('Please paste valid CSV content.');
      return;
    }
    try {
      onApplyCSV(pasteContent);
      onClose();
    } catch {
      setErrorMsg('Invalid CSV structure. Please verify columns.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-purple-800/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                CSV Financial Data Manager
              </h3>
              <p className="text-xs text-zinc-400">
                Inspect, upload, or paste financial transaction data
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

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-5 pt-2 gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('inspect');
              setErrorMsg(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'inspect'
                ? 'border-purple-500 text-purple-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Current CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setErrorMsg(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-purple-500 text-purple-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('paste');
              setErrorMsg(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-purple-500 text-purple-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Paste Raw CSV
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {activeTab === 'inspect' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Active CSV dataset loaded in memory:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy CSV</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetDefault();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/50 border border-purple-800/40 text-purple-300 hover:bg-purple-900/40 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Original Prompt Data</span>
                  </button>
                </div>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-72 leading-relaxed">
                {currentCSVText}
              </pre>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4 text-center py-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-purple-500 rounded-2xl p-8 cursor-pointer bg-zinc-950/40 hover:bg-purple-950/10 transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">
                    Click to select or drag a CSV file here
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Accepts standard CSV with Date, Description, Category, Type, Amount
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-zinc-300 font-medium">
                Paste raw CSV text:
              </label>
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder={RAW_SAMPLE_CSV}
                rows={9}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 font-mono text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyPaste}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md transition-colors"
                >
                  Parse & Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950/70 border-t border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

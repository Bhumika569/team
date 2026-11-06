import React from 'react';
import { X, Keyboard, Zap, Shield, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <h2 id="help-title" className="text-base font-bold text-slate-900 dark:text-white">
              TaskFlow Guide & Productivity Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Smart Priority Algorithm */}
          <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>How Smart Prioritization Works</span>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              TaskFlow calculates a dynamic priority score for each task based on:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li><strong>Priority level:</strong> High (300 pts) · Medium (200 pts) · Low (100 pts)</li>
              <li><strong>Deadline urgency:</strong> Overdue (+500 pts) · Due Today (+400 pts) · Within 2 Days (+300 pts) · Within 7 Days (+200 pts)</li>
              <li><strong>Completed separation:</strong> Completed items are cleanly grouped below active items.</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
              <Keyboard className="w-4 h-4 text-slate-500" />
              <span>Productivity Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800">
                <span>New Task</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">N</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800">
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">Cmd+K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800">
                <span>Close Dialog</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">Esc</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800">
                <span>Toggle Theme</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">T</kbd>
              </div>
            </div>
          </div>

          {/* Security & RLS */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Multi-Tenant Row Level Security (RLS)</span>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              Every database operation verifies that <code className="font-mono text-indigo-600 dark:text-indigo-400">auth.uid() = user_id</code>. Your tasks, notes, and productivity stats are strictly private to your authenticated account.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingTask, setDeletingTask, deleteTask } = useTasks();

  if (!deletingTask) return null;

  const handleConfirm = async () => {
    await deleteTask(deletingTask.id);
    setDeletingTask(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setDeletingTask(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-base font-semibold text-slate-900 dark:text-white">
              Delete Task
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                &ldquo;{deletingTask.title}&rdquo;
              </span>
              ? This operation cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeletingTask(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

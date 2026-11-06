import React from 'react';
import { X, Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle, Tag, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { formatDueDate, isOverdue, isDueToday, CATEGORY_CONFIG, PRIORITY_CONFIG, calculateSmartScore } from '../lib/taskUtils';

export const TaskDetailModal: React.FC = () => {
  const { viewingTask, setViewingTask, setEditingTask, setDeletingTask, toggleTaskCompletion } = useTasks();

  if (!viewingTask) return null;

  const overdue = isOverdue(viewingTask);
  const dueToday = isDueToday(viewingTask);
  const catStyle = CATEGORY_CONFIG[viewingTask.category];
  const priorityStyle = PRIORITY_CONFIG[viewingTask.priority];
  const smartScore = calculateSmartScore(viewingTask);

  const handleEdit = () => {
    const taskToEdit = viewingTask;
    setViewingTask(null);
    setEditingTask(taskToEdit);
  };

  const handleDelete = () => {
    const taskToDelete = viewingTask;
    setViewingTask(null);
    setDeletingTask(taskToDelete);
  };

  const handleToggle = async () => {
    const updated = await toggleTaskCompletion(viewingTask.id);
    setViewingTask(updated);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors border"
              style={{
                borderColor: viewingTask.completed ? '#10b981' : '#64748b',
                color: viewingTask.completed ? '#059669' : '#475569',
              }}
            >
              {viewingTask.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              Smart Score: {smartScore}
            </span>
          </div>

          <button
            onClick={() => setViewingTask(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title */}
        <div className="mt-4">
          <h2
            id="detail-title"
            className={`text-xl font-bold text-slate-900 dark:text-white ${
              viewingTask.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {viewingTask.title}
          </h2>

          {/* Metadata badges with Anti-slop zero-pill text separators */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium ${priorityStyle.badge}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityStyle.dotColor }} />
              {priorityStyle.label}
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium ${catStyle.bg} ${catStyle.darkBg} ${catStyle.border}`}>
              <Tag className="w-3 h-3" />
              {catStyle.label}
            </span>

            {overdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-medium">
                <AlertTriangle className="w-3 h-3" />
                Overdue
              </span>
            )}

            {dueToday && !viewingTask.completed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-medium">
                <Clock className="w-3 h-3" />
                Due Today
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Description
          </label>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[70px] border border-slate-200/60 dark:border-slate-800 whitespace-pre-wrap">
            {viewingTask.description || <span className="text-slate-400 italic">No detailed description provided.</span>}
          </div>
        </div>

        {/* Timestamps & Info Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <div className="text-slate-400">Due Date</div>
              <div className="font-semibold text-slate-900 dark:text-slate-200">
                {formatDueDate(viewingTask.due_date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-slate-400">Created</div>
              <div className="font-mono tabular-nums text-slate-900 dark:text-slate-200">
                {new Date(viewingTask.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* RLS Security Note */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Secured with Supabase Row Level Security (RLS) under authenticated user boundary.</span>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Task
            </button>
            <button
              type="button"
              onClick={() => setViewingTask(null)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

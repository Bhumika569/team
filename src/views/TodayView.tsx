import React from 'react';
import { Clock, Plus, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { isDueToday, isOverdue } from '../lib/taskUtils';

export const TodayView: React.FC = () => {
  const { tasks, setIsAddModalOpen, setPrefilledDueDate } = useTasks();

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => isDueToday(t));
  const activeTodayTasks = todayTasks.filter((t) => !t.completed);
  const completedTodayTasks = todayTasks.filter((t) => t.completed);

  // Overdue tasks that need carryover attention
  const overdueTasks = tasks.filter((t) => isOverdue(t));

  const handleAddForToday = () => {
    setPrefilledDueDate(todayIso);
    setIsAddModalOpen(true);
  };

  const todayCompletionRate =
    todayTasks.length === 0
      ? 100
      : Math.round((completedTodayTasks.length / todayTasks.length) * 100);

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Today&apos;s Focus
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Concentrate on high-priority deliverables and maintain steady daily momentum.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddForToday}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task for Today</span>
        </button>
      </div>

      {/* Daily Progress Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Daily Completion Progress
          </span>
          <span className="font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
            {completedTodayTasks.length} / {todayTasks.length} ({todayCompletionRate}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${todayCompletionRate}%` }}
          />
        </div>
      </div>

      {/* Overdue Attention Warning (if any) */}
      {overdueTasks.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                Overdue Tasks ({overdueTasks.length})
              </h3>
            </div>
            <span className="text-[11px] text-rose-600 dark:text-rose-400">
              Needs immediate action
            </span>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}

      {/* Main Today Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Scheduled For Today ({activeTodayTasks.length} remaining)
          </h2>
        </div>

        {activeTodayTasks.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              All tasks for today are done!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Outstanding work! You have cleared your schedule for today or can add new goals.
            </p>
            <button
              type="button"
              onClick={handleAddForToday}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Plan another task
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeTodayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Today Section */}
      {completedTodayTasks.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed Today ({completedTodayTasks.length})</span>
          </h2>
          <div className="space-y-2.5">
            {completedTodayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

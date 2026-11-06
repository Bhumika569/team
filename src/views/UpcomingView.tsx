import React from 'react';
import { CalendarDays, Plus, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { isDueToday, isDueTomorrow } from '../lib/taskUtils';

export const UpcomingView: React.FC = () => {
  const { tasks, setIsAddModalOpen, setPrefilledDueDate } = useTasks();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Bucket tasks
  const pendingWithDates = tasks.filter((t) => !t.completed && t.due_date);

  const todayList = pendingWithDates.filter((t) => isDueToday(t));
  const tomorrowList = pendingWithDates.filter((t) => isDueTomorrow(t));

  const thisWeekList = pendingWithDates.filter((t) => {
    if (isDueToday(t) || isDueTomorrow(t)) return false;
    const dueTime = new Date(t.due_date!).getTime();
    const diffDays = Math.round((dueTime - todayStart) / (1000 * 60 * 60 * 24));
    return diffDays >= 2 && diffDays <= 7;
  });

  const laterList = pendingWithDates.filter((t) => {
    const dueTime = new Date(t.due_date!).getTime();
    const diffDays = Math.round((dueTime - todayStart) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  });

  const noDateList = tasks.filter((t) => !t.completed && !t.due_date);

  const handleQuickAdd = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    setPrefilledDueDate(target.toISOString().slice(0, 10));
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Upcoming Schedule & Deadlines
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize approaching deliverables sorted by chronology and urgency.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPrefilledDueDate(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Timeline Section: Today */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 text-xs font-bold">
              1
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Today ({todayList.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleQuickAdd(0)}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold"
          >
            + Add for today
          </button>
        </div>

        {todayList.length === 0 ? (
          <p className="text-xs text-slate-400 italic pl-8">No tasks scheduled for today.</p>
        ) : (
          <div className="space-y-2 pl-2 sm:pl-8">
            {todayList.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>

      {/* Timeline Section: Tomorrow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 text-xs font-bold">
              2
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Tomorrow ({tomorrowList.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleQuickAdd(1)}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold"
          >
            + Add for tomorrow
          </button>
        </div>

        {tomorrowList.length === 0 ? (
          <p className="text-xs text-slate-400 italic pl-8">No tasks scheduled for tomorrow.</p>
        ) : (
          <div className="space-y-2 pl-2 sm:pl-8">
            {tomorrowList.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>

      {/* Timeline Section: This Week */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-bold">
              3
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Next 7 Days ({thisWeekList.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleQuickAdd(3)}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold"
          >
            + Add for this week
          </button>
        </div>

        {thisWeekList.length === 0 ? (
          <p className="text-xs text-slate-400 italic pl-8">No other deadlines in the next 7 days.</p>
        ) : (
          <div className="space-y-2 pl-2 sm:pl-8">
            {thisWeekList.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>

      {/* Timeline Section: Later */}
      {laterList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold">
              4
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Later & Future ({laterList.length})
            </h2>
          </div>
          <div className="space-y-2 pl-2 sm:pl-8">
            {laterList.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}

      {/* Unscheduled Backlog Tasks */}
      {noDateList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2">
            No Due Date Assigned ({noDateList.length})
          </h2>
          <div className="space-y-2 pl-2 sm:pl-8">
            {noDateList.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

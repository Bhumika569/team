import React from 'react';
import { Check, Calendar, Trash2, Edit2, AlertTriangle, Eye, Clock } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDueDate, isOverdue, isDueToday, CATEGORY_CONFIG, PRIORITY_CONFIG } from '../lib/taskUtils';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const { toggleTaskCompletion, setEditingTask, setDeletingTask, setViewingTask } = useTasks();

  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const catStyle = CATEGORY_CONFIG[task.category];
  const priorityStyle = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/60 opacity-75'
          : overdue
          ? 'bg-white border-rose-200 dark:bg-slate-900 dark:border-rose-900/60 shadow-xs'
          : 'bg-white border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Left: Checkbox & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Custom styled Checkbox */}
        <button
          type="button"
          onClick={() => toggleTaskCompletion(task.id)}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600 dark:hover:border-indigo-400 bg-white dark:bg-slate-800'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
        >
          {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
        </button>

        {/* Title and snippet */}
        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => setViewingTask(task)}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold truncate ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
              }`}
            >
              {task.title}
            </span>
          </div>

          {!compact && task.description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              {task.description}
            </p>
          )}

          {/* Clean metadata strip (Zero-pill text separators) */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {/* Category tag */}
            <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catStyle.color }} />
              {catStyle.label}
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            {/* Priority tag */}
            <span className={`font-medium ${priorityStyle.textColor}`}>
              {task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            {/* Due date */}
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                overdue && !task.completed
                  ? 'text-rose-600 dark:text-rose-400'
                  : dueToday && !task.completed
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {overdue && !task.completed ? (
                <AlertTriangle className="w-3 h-3 text-rose-500" />
              ) : dueToday && !task.completed ? (
                <Clock className="w-3 h-3 text-amber-500" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {formatDueDate(task.due_date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setViewingTask(task)}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="View Task Details"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setEditingTask(task)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
          title="Edit Task"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setDeletingTask(task)}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          title="Delete Task"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

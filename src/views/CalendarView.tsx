import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, isDueToday } from '../lib/taskUtils';

type CalendarViewMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC = () => {
  const { tasks, setIsAddModalOpen, setPrefilledDueDate, setViewingTask } = useTasks();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCellClick = (dateStr: string) => {
    setPrefilledDueDate(dateStr);
    setIsAddModalOpen(true);
  };

  // Month View calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  // Convert to Mon=0 .. Sun=6
  const startDayOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthCells: Array<{ dayNum: number; dateStr: string; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const d = new Date(year, month - 1, day);
    monthCells.push({
      dayNum: day,
      dateStr: d.toISOString().slice(0, 10),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    monthCells.push({
      dayNum: i,
      dateStr: d.toISOString().slice(0, 10),
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remaining = 35 - monthCells.length;
  const totalSlots = remaining < 0 ? 42 : 35;
  const neededNext = totalSlots - monthCells.length;
  for (let i = 1; i <= neededNext; i++) {
    const d = new Date(year, month + 1, i);
    monthCells.push({
      dayNum: i,
      dateStr: d.toISOString().slice(0, 10),
      isCurrentMonth: false,
    });
  }

  // Week View calculations
  const getWeekDays = (refDate: Date) => {
    const dayIndex = (refDate.getDay() + 6) % 7; // Mon = 0
    const monday = new Date(refDate);
    monday.setDate(refDate.getDate() - dayIndex);

    const week: Array<{ date: Date; dateStr: string }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push({ date: d, dateStr: d.toISOString().slice(0, 10) });
    }
    return week;
  };
  const weekDays = getWeekDays(currentDate);

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (t.due_date) {
      const key = t.due_date.slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
    }
    return acc;
  }, {});

  const monthName = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{monthName}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Color-coded deadline calendar. Click any date to schedule a new task.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Mode Tabs: Month, Week, Day */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Day
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setPrefilledDueDate(todayStr);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Priority Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Priority Coding:
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>High Priority</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium Priority</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Low Priority</span>
          </span>
        </div>
      </div>

      {/* View Mode 1: Monthly Calendar */}
      {viewMode === 'month' && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
          {/* Day Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-center text-xs font-semibold text-slate-500 py-2.5">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {monthCells.map((cell, idx) => {
              const dayTasks = tasksByDate[cell.dateStr] || [];
              const isTodayCell = cell.dateStr === todayStr;

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => handleCellClick(cell.dateStr)}
                  className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                    cell.isCurrentMonth
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                      : 'bg-slate-50/50 dark:bg-slate-950/40 opacity-40'
                  } ${isTodayCell ? 'ring-2 ring-indigo-500/80 inset-0 z-10' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono tabular-nums h-6 w-6 rounded-full flex items-center justify-center ${
                        isTodayCell
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {/* Quick plus icon on cell hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(cell.dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 rounded transition-opacity"
                      title="Add task on this date"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tasks rendered on this date */}
                  <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-20">
                    {dayTasks.slice(0, 3).map((task) => {
                      const priorityColor =
                        task.priority === 'HIGH'
                          ? 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-300'
                          : task.priority === 'MEDIUM'
                          ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/70 dark:text-amber-300'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300';

                      return (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingTask(task);
                          }}
                          className={`px-1.5 py-0.5 rounded border text-[11px] font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 ${priorityColor} ${
                            task.completed ? 'line-through opacity-60' : ''
                          }`}
                          title={task.title}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: PRIORITY_CONFIG[task.priority].dotColor,
                            }}
                          />
                          <span className="truncate">{task.title}</span>
                        </div>
                      );
                    })}

                    {dayTasks.length > 3 && (
                      <div className="text-[10px] font-semibold text-slate-500 pl-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode 2: Weekly Calendar */}
      {viewMode === 'week' && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
            {weekDays.map((item) => {
              const dayTasks = tasksByDate[item.dateStr] || [];
              const isTodayCell = item.dateStr === todayStr;

              return (
                <div
                  key={item.dateStr}
                  onClick={() => handleCellClick(item.dateStr)}
                  className={`min-h-[450px] p-3 flex flex-col justify-between cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors ${
                    isTodayCell ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                  }`}
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="text-xs uppercase text-slate-400 font-semibold">
                      {item.date.toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                    <div
                      className={`text-lg font-bold font-mono mt-0.5 ${
                        isTodayCell
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.date.getDate()}
                    </div>
                  </div>

                  <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingTask(t);
                        }}
                        className={`p-2 rounded-lg border text-xs shadow-2xs hover:shadow-xs transition-shadow cursor-pointer ${
                          t.completed
                            ? 'bg-slate-50 dark:bg-slate-800/40 opacity-60 line-through'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {t.title}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span
                            className="font-medium"
                            style={{ color: PRIORITY_CONFIG[t.priority].dotColor }}
                          >
                            {t.priority}
                          </span>
                          <span>{t.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(item.dateStr);
                    }}
                    className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                  >
                    + Add Task
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode 3: Daily Calendar */}
      {viewMode === 'day' && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs p-6 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Selected Day</div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {currentDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleCellClick(currentDate.toISOString().slice(0, 10))}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task for Day
            </button>
          </div>

          <div className="space-y-2.5">
            {(tasksByDate[currentDate.toISOString().slice(0, 10)] || []).length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No tasks scheduled for this day. Click above to add one.
              </div>
            ) : (
              (tasksByDate[currentDate.toISOString().slice(0, 10)] || []).map((t) => (
                <div
                  key={t.id}
                  onClick={() => setViewingTask(t)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <div>
                    <h3
                      className={`text-sm font-semibold text-slate-900 dark:text-white ${
                        t.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {t.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{t.category}</span>
                      <span>·</span>
                      <span className={PRIORITY_CONFIG[t.priority].textColor}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                  {t.completed && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

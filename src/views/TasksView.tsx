import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Plus,
  ArrowUpDown,
  LayoutList,
  Kanban,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskPriority, TaskCategory, SortOption } from '../types';

export const TasksView: React.FC = () => {
  const {
    filteredTasks,
    tasks,
    filters,
    setFilters,
    resetFilters,
    sortOption,
    setSortOption,
    selectedCategory,
    setSelectedCategory,
    setIsAddModalOpen,
  } = useTasks();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const categories: TaskCategory[] = ['Work', 'Personal', 'Study', 'Projects'];
  const priorities: TaskPriority[] = ['HIGH', 'MEDIUM', 'LOW'];

  const isFiltered =
    filters.search !== '' ||
    filters.priority !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.status !== 'ALL' ||
    selectedCategory !== 'ALL';

  // Kanban Board Columns
  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & View Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Tasks</span>
            <span className="text-sm font-mono tabular-nums font-normal text-slate-500">
              ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritize, filter, and organize your work across all active projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: List vs Kanban */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Board View"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          {/* New Task CTA */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Category Tabs, Priority, Status, Sort */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3">
        {/* Row 1: Search & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search by task title or description..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="smart">✨ Smart Priority (Recommended)</option>
              <option value="due_date">📅 Due Date (Earliest First)</option>
              <option value="highest_priority">🔥 Highest Priority</option>
              <option value="recently_created">🕒 Recently Created</option>
            </select>
          </div>
        </div>

        {/* Row 2: Interactive Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Segmented Filter */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setFilters((prev) => ({ ...prev, category: 'ALL' }));
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.category === 'ALL' && selectedCategory === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat || filters.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilters((prev) => ({ ...prev, category: cat }));
                    }}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value as TaskPriority | 'ALL' }))
              }
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Priorities</option>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p === 'HIGH' ? 'High Priority' : p === 'MEDIUM' ? 'Medium Priority' : 'Low Priority'}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value as any }))
              }
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="COMPLETED">Completed Only</option>
              <option value="OVERDUE">Overdue Only</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40">
              <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No matching tasks found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isFiltered
                  ? 'Try adjusting or clearing your filters to see more tasks.'
                  : 'Get started by creating your first task!'}
              </p>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 rounded-lg"
                >
                  Reset Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: In Progress / Pending */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col h-[700px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  In Progress & Pending
                </h3>
              </div>
              <span className="font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {pendingTasks.length}
              </span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
              {pendingTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No active pending tasks!
                </div>
              ) : (
                pendingTasks.map((t) => <TaskCard key={t.id} task={t} />)
              )}
            </div>
          </div>

          {/* Column 2: Completed */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col h-[700px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Completed
                </h3>
              </div>
              <span className="font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {completedTasks.length}
              </span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
              {completedTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Completed tasks will appear here.
                </div>
              ) : (
                completedTasks.map((t) => <TaskCard key={t.id} task={t} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

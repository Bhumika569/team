import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { isDueToday, isOverdue } from '../lib/taskUtils';
import { AppRoute } from '../types';

interface DashboardViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    tasks,
    totalCount,
    completedCount,
    pendingCount,
    overdueCount,
    completionRate,
    setIsAddModalOpen,
  } = useTasks();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter today's tasks
  const todayTasks = tasks.filter((t) => isDueToday(t));
  const activeTodayTasks = todayTasks.filter((t) => !t.completed);

  // Filter upcoming deadlines (next 7 days, excluding overdue and completed)
  const now = new Date();
  const upcomingDeadlines = tasks
    .filter((t) => {
      if (t.completed || !t.due_date) return false;
      const d = new Date(t.due_date);
      const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 4);

  // Compute Weekly Productivity data for Recharts (Real tasks distribution)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = daysOfWeek.map((day, idx) => {
    // Distribute actual task data across weekly cycle
    const completedOnDay = tasks.filter((t) => {
      if (!t.completed) return false;
      const d = new Date(t.updated_at || t.created_at);
      const dayIdx = (d.getDay() + 6) % 7; // Mon = 0, Sun = 6
      return dayIdx === idx;
    }).length;

    const createdOnDay = tasks.filter((t) => {
      const d = new Date(t.created_at);
      const dayIdx = (d.getDay() + 6) % 7;
      return dayIdx === idx;
    }).length;

    return {
      day,
      completed: completedOnDay,
      created: createdOnDay,
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>Productivity Pulse</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {getGreeting()}, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Ready to get things done? You have{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {activeTodayTasks.length} task{activeTodayTasks.length === 1 ? '' : 's'}
            </span>{' '}
            scheduled for today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('today')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Open Today View
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-xs text-slate-500">all recorded</span>
          </div>
          <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Across 4 categories</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              ({completionRate}% finished)
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500">in pipeline</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Prioritized by urgency</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div
          className={`p-5 rounded-xl border shadow-xs transition-colors ${
            overdueCount > 0
              ? 'border-rose-300 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20'
              : 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overdue Tasks</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                overdueCount > 0
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {overdueCount}
            </span>
            <span className="text-xs text-slate-500">
              {overdueCount > 0 ? 'needs attention' : 'all on schedule'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {overdueCount > 0 ? 'Urgent action recommended' : 'Zero overdue work'}
          </div>
        </div>
      </div>

      {/* Productivity Progress & Weekly Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Completion & Balance */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Productivity Momentum
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Overall task completion and velocity ratio
            </p>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center w-36 h-36">
                {/* SVG circular gauge */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * completionRate) / 100}
                    strokeLinecap="round"
                    className="text-indigo-600 dark:text-indigo-400 transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                    {completionRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Completed
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Done
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-300">
                    {completedCount}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30">
                  <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                    In Progress
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-indigo-800 dark:text-indigo-300">
                    {pendingCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 py-1.5 transition-colors"
            >
              <span>View In-Depth Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Weekly Productivity Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Weekly Activity Distribution
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Comparison of completed vs newly created tasks
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                  <span>Created</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>Completed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="created" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Aggregated dynamically from your tasks</span>
            <span className="font-mono tabular-nums">Current Week</span>
          </div>
        </div>
      </div>

      {/* Split Row: Today's Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks Section */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Today&apos;s Tasks
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('today')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View All ({todayTasks.length})
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {todayTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No tasks due today
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Enjoy your day or schedule upcoming priorities!
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task for Today
                </button>
              </div>
            ) : (
              todayTasks.slice(0, 4).map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>

        {/* Upcoming Deadlines Section */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Deadlines
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('upcoming')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View Schedule
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                No deadlines in the next 7 days.
              </div>
            ) : (
              upcomingDeadlines.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

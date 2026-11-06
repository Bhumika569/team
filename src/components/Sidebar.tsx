import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  X,
  Briefcase,
  User,
  GraduationCap,
  FolderGit2,
  Database,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppRoute, TaskCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { CATEGORY_CONFIG, isDueToday } from '../lib/taskUtils';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSupabaseModal: () => void;
  onOpenHelpModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  onOpenSupabaseModal,
  onOpenHelpModal,
}) => {
  const { user, logout, isLiveSupabase } = useAuth();
  const {
    tasks,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
  } = useTasks();

  const todayCount = tasks.filter((t) => !t.completed && isDueToday(t)).length;

  const navItems: Array<{
    id: AppRoute;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: tasks.filter((t) => !t.completed).length,
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Clock className="w-4 h-4" />,
      badge: todayCount > 0 ? todayCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  const categories: Array<{ id: TaskCategory; label: string; icon: React.ReactNode }> = [
    { id: 'Work', label: 'Work', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'Personal', label: 'Personal', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'Study', label: 'Study', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'Projects', label: 'Projects', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (route: AppRoute) => {
    setSelectedCategory('ALL');
    onNavigate(route);
    onCloseMobile();
  };

  const handleCategoryClick = (cat: TaskCategory) => {
    setSelectedCategory(cat);
    onNavigate('tasks');
    onCloseMobile();
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
    onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-white p-4 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Brand & Main Navigation */}
      <div>
        {/* Brand Lockup */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                TaskFlow
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold">
                  SaaS
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Tag */}
        <div className="mt-3">
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLiveSupabase ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="truncate">
                {isLiveSupabase ? 'Supabase Postgres' : 'Local Storage Engine'}
              </span>
            </span>
            <Database className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Primary Links */}
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const active = currentRoute === item.id && selectedCategory === 'ALL';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`font-mono tabular-nums text-[11px] px-1.5 py-0.5 rounded-md ${
                      item.badgeColor ||
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Categories Section */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Categories
          </div>
          <div className="space-y-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id && currentRoute === 'tasks';
              const cfg = CATEGORY_CONFIG[cat.id];
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span>{cat.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[11px] text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Settings, Help, Profile */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
        <button
          type="button"
          onClick={() => {
            onNavigate('settings');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            currentRoute === 'settings'
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={onOpenHelpModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Shortcuts</span>
        </button>

        {/* User Profile Card */}
        {user ? (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user.avatar_url || '/src/assets/images/avatar_user_profile_1793946784815.jpg'}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.full_name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleNavClick('login')}
            className="w-full mt-2 py-2 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-xs flex-1 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

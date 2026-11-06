import React, { useState } from 'react';
import {
  User,
  Database,
  Moon,
  Sun,
  Bell,
  Download,
  RotateCcw,
  Shield,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

interface SettingsViewProps {
  onOpenSupabaseModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenSupabaseModal }) => {
  const { user, updateProfile, isLiveSupabase } = useAuth();
  const {
    theme,
    toggleTheme,
    browserNotificationsEnabled,
    requestBrowserNotifications,
    exportTasksJSON,
    exportTasksCSV,
    resetToSampleTasks,
  } = useTasks();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    const res = await updateProfile({ full_name: fullName.trim() });
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } else {
      setProfileError(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Application & Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal profile, cloud database configuration, and productivity preferences.
        </p>
      </div>

      {/* Section 1: User Profile */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">User Profile</h2>
            <p className="text-xs text-slate-500">Your identity and email boundary</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || '/src/assets/images/avatar_user_profile_1793946784815.jpg'}
              alt={user?.full_name || 'User avatar'}
              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500/20"
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {user?.full_name || 'Guest User'}
              </div>
              <div className="text-xs text-slate-500">{user?.email}</div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono">
                User ID: {user?.id}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-850 cursor-not-allowed"
              />
            </div>
          </div>

          {profileError && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {profileSaved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Supabase Database & RLS */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Supabase PostgreSQL & Row Level Security
              </h2>
              <p className="text-xs text-slate-500">
                Multi-tenant data isolation and direct Postgres integration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-lg"
          >
            Configure Database
          </button>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                isLiveSupabase ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-amber-500 ring-4 ring-amber-500/20'
              }`}
            />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {isLiveSupabase
                  ? 'Connected to Live Cloud Supabase'
                  : 'Active Mode: Resilient Local Storage Engine'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isLiveSupabase
                  ? 'All tasks are synchronized with your Supabase PostgreSQL cluster with active RLS policies.'
                  : 'Zero external keys needed. All tasks and registered users persist safely in browser storage.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              RLS Protected
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Appearance & Theme */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
            <p className="text-xs text-slate-500">Switch between Crisp Light and Deep Charcoal Dark</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Color Mode: {theme === 'dark' ? 'Deep Charcoal Dark' : 'Crisp White Light'}
            </div>
            <div className="text-[11px] text-slate-500">
              Preference automatically saved and restored on page refresh.
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-xs transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section 4: Notifications & Reminder Setup */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifications & Reminders
            </h2>
            <p className="text-xs text-slate-500">Browser alerts and scheduled email reminders</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Desktop Push Notifications
            </div>
            <div className="text-[11px] text-slate-500">
              Receive timely alerts when tasks are due today or overdue.
            </div>
          </div>

          {browserNotificationsEnabled ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Enabled
            </span>
          ) : (
            <button
              type="button"
              onClick={requestBrowserNotifications}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Request Permission
            </button>
          )}
        </div>

        {/* Scheduled Reminders Architecture Note */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            Automated Daily Email Reminders Architecture
          </div>
          <p className="text-[11px] leading-relaxed">
            For production email dispatching (e.g. morning daily digest at 8:00 AM), connect a cron runner such as Supabase <code className="font-mono text-indigo-600 dark:text-indigo-400">pg_cron</code> or Vercel Cron calling a serverless edge endpoint with Resend or SendGrid. In client mode, real-time in-app badges and desktop notifications are active.
          </p>
        </div>
      </div>

      {/* Section 5: Data Management & Export */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Portability & Backup
            </h2>
            <p className="text-xs text-slate-500">Download your task logs or restore sample data</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={exportTasksJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export as JSON</span>
          </button>

          <button
            type="button"
            onClick={exportTasksCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export as CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset tasks to realistic sample seed data? Current changes will be overwritten.')) {
                resetToSampleTasks();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 rounded-lg transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

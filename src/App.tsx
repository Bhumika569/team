/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { AppRoute } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SupabaseConnectModal } from './components/SupabaseConnectModal';
import { HelpModal } from './components/HelpModal';

import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { TodayView } from './views/TodayView';
import { UpcomingView } from './views/UpcomingView';
import { CalendarView } from './views/CalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { setIsAddModalOpen, toggleTheme } = useTasks();

  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Synchronize route with browser history / URL path if available
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '');
    const validRoutes: AppRoute[] = [
      'landing',
      'login',
      'register',
      'forgot-password',
      'dashboard',
      'tasks',
      'today',
      'upcoming',
      'calendar',
      'analytics',
      'settings',
    ];

    if (validRoutes.includes(path as AppRoute)) {
      setCurrentRoute(path as AppRoute);
    } else if (user) {
      setCurrentRoute('dashboard');
    }
  }, [user]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAddModalOpen(true);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHelpModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAddModalOpen, toggleTheme]);

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route === 'landing' ? '/' : `/${route}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Initializing TaskFlow...</span>
        </div>
      </div>
    );
  }

  // Public Unauthenticated Pages
  if (currentRoute === 'landing') {
    return <LandingPageView onNavigate={handleNavigate} />;
  }
  if (currentRoute === 'login') {
    return <LoginView onNavigate={handleNavigate} />;
  }
  if (currentRoute === 'register') {
    return <RegisterView onNavigate={handleNavigate} />;
  }
  if (currentRoute === 'forgot-password') {
    return <ForgotPasswordView onNavigate={handleNavigate} />;
  }

  // Protected Dashboard Routes: redirect to login if unauthenticated
  if (!user) {
    return <LoginView onNavigate={handleNavigate} />;
  }

  // Main Authenticated SaaS Dashboard Shell
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        <main className="flex-1 pb-16">
          {currentRoute === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {currentRoute === 'tasks' && <TasksView />}
          {currentRoute === 'today' && <TodayView />}
          {currentRoute === 'upcoming' && <UpcomingView />}
          {currentRoute === 'calendar' && <CalendarView />}
          {currentRoute === 'analytics' && <AnalyticsView />}
          {currentRoute === 'settings' && (
            <SettingsView onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <TaskDetailModal />
      <DeleteConfirmModal />
      <SupabaseConnectModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainAppContent />
      </TaskProvider>
    </AuthProvider>
  );
}

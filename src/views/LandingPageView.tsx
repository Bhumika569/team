import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  BarChart3,
  Shield,
  Layers,
  Zap,
  ChevronDown,
  Check,
  Clock,
  ListTodo,
} from 'lucide-react';
import { AppRoute } from '../types';
import { useAuth } from '../context/AuthContext';

interface LandingPageViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleStart = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      onNavigate('register');
    }
  };

  const faqs = [
    {
      q: 'How does TaskFlow calculate the Smart Priority score?',
      a: 'The algorithm evaluates base priority weights (High: 300, Medium: 200, Low: 100) and adds dynamic deadline urgency points (Overdue: +500, Due Today: +400, Within 2 Days: +300, Within 7 Days: +200). Incomplete tasks are prioritized above completed tasks so your attention is focused where it matters most.',
    },
    {
      q: 'Can I connect my own Supabase PostgreSQL database?',
      a: 'Yes. TaskFlow comes ready with full Supabase integration. You can connect your existing Supabase project simply by adding your Project URL and Anon API Key in Settings or your environment configuration. A complete SQL migration script with Row Level Security (RLS) is provided out-of-the-box.',
    },
    {
      q: 'Does TaskFlow work without a cloud database configured?',
      a: 'Absolutely. TaskFlow includes an automatic resilient local persistent engine with multi-user isolation. You can create accounts, log in, manage tasks, and track productivity immediately with zero setup required.',
    },
    {
      q: 'How is my private task data secured?',
      a: 'Security is enforced at the database level using PostgreSQL Row Level Security (RLS). Every read, insert, update, and delete query is validated against auth.uid() = user_id. Even on shared databases, users can never access or modify another person’s data.',
    },
    {
      q: 'Does TaskFlow support dark mode?',
      a: 'Yes! TaskFlow provides a complete dual-theme design system with crisp light mode and deep charcoal dark mode, persisted across sessions and compatible with system color scheme preferences.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              TaskFlow
            </span>
          </div>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Features
            </a>
            <a href="#preview" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Product Preview
            </a>
            <a href="#benefits" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Benefits
            </a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              FAQ
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-900/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Task Management SaaS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]" style={{ textWrap: 'balance' }}>
              Take Control of Your Time. Get More Done.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              The modern task management SaaS built for high-velocity teams and focused individuals.
              Smart deadline prioritization, interactive calendars, and deep productivity analytics backed by Supabase.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleStart}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
              >
                Sign In to Account
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Free tier forever
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                No credit card required
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Supabase RLS protected
              </span>
            </div>
          </div>

          {/* Interactive Product Dashboard Preview */}
          <div id="preview" className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="text-xs font-mono text-slate-500">taskflow.app/dashboard</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={handleStart}>
                Launch App →
              </div>
            </div>

            {/* Inner Interactive Preview Body */}
            <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
              {/* Mini Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500 font-medium">Total Tasks</div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">24</div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">Active workspace</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500 font-medium">Completed</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1">18</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">75% velocity</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500 font-medium">Due Today</div>
                  <div className="text-xl font-bold font-mono text-amber-600 mt-1">4</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">Prioritized</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500 font-medium">Overdue</div>
                  <div className="text-xl font-bold font-mono text-slate-400 mt-1">0</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">All on track</div>
                </div>
              </div>

              {/* Sample Task Stream preview */}
              <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Smart Priority Queue</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Sorted by Urgency + Weight</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-md border border-indigo-500 flex items-center justify-center text-[10px] text-indigo-600">✓</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Deploy Q4 Core Architecture to Production</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">High Priority</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">Today</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-md border border-slate-300 dark:border-slate-600" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Audit Row Level Security policies with Supabase CLI</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">Medium</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">Tomorrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Built to Eliminate Distractions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Everything you need to plan your week, stay ahead of deadlines, and maintain focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                01. Smart Task Prioritization
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatic mathematical ranking weighing priority level (High, Medium, Low) against real deadline urgency so you never drop critical deliverables.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                02. Interactive Calendar Views
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Seamlessly toggle between Monthly, Weekly, and Daily schedules. Color-code tasks by urgency and create tasks by clicking directly on calendar dates.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                03. Productivity & Velocity Metrics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive Recharts tracking weekly completion velocity, category distribution (Work, Personal, Study, Projects), and priority turnaround times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Why Professionals Choose TaskFlow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Designed for Speed, Security, and Effortless Clarity
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Most task applications are either bloated spreadsheets or oversimplified checklists. TaskFlow strikes the ideal balance inspired by Linear and Notion.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Zero-Friction CRUD Operations
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Create, edit, sort, and complete tasks with lightning-fast response times and optimistic updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Enterprise PostgreSQL & Row Level Security (RLS)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Multi-tenant security enforced directly at the database engine with complete schema migration scripts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      List & Kanban Board Flexibility
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Switch effortlessly between streamlined list rows and multi-column workflow boards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Workspace Hero Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src="/src/assets/images/hero_collaboration_1793946785525.jpg"
                alt="Modern collaborative workspace with productivity screens"
                className="w-full h-[380px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-sm font-bold">Engineered for High-Performance Workflows</div>
                  <div className="text-xs text-slate-300">Clean visual hierarchy with zero clutter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Free Plan */}
      <section id="pricing" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Start Free, Scale as You Grow
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every feature you need for daily task mastery is free forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-6 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-850 shadow-md relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                Most Popular
              </div>

              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Starter Free</div>
                <p className="text-xs text-slate-500 mt-1">For focused individual productivity</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Unlimited tasks & categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Smart Priority scoring algorithm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Month, Week & Day interactive calendar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Full productivity analytics & charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Supabase PostgreSQL + RLS ready</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="mt-8 w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Pro Workspace</div>
                <p className="text-xs text-slate-500 mt-1">For power users & freelancers</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">$12</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Everything in Starter Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Automated daily email digests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Kanban board swimlanes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>JSON and CSV automated backups</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="mt-8 w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Team Enterprise */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Enterprise</div>
                <p className="text-xs text-slate-500 mt-1">For organizations requiring compliance</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">$39</span>
                  <span className="text-xs text-slate-500">/ seat / mo</span>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Dedicated Supabase cluster pairing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Custom RLS security auditing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>99.9% uptime SLA & priority support</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="mt-8 w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with interactive accordion */}
      <section id="faq" className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Questions & Answers
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Daily Focus?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Join professionals using TaskFlow to prioritize high-leverage work, manage deadlines, and build unstoppable productivity streaks.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStart}
              className="px-8 py-3.5 text-sm font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-colors"
            >
              Get Started Free Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">TaskFlow</span>
            <span>· All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white">FAQ</a>
            <button type="button" onClick={() => onNavigate('login')} className="hover:text-slate-900 dark:hover:text-white">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

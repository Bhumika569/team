import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Task, User } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

// Check environment or localStorage override
export function getStoredSupabaseConfig(): SupabaseConfig {
  const customStr = localStorage.getItem('taskflow_supabase_config');
  if (customStr) {
    try {
      const parsed = JSON.parse(customStr);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, isCustom: true };
      }
    } catch {
      // ignore
    }
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const isValidUrl =
    envUrl.startsWith('http://') || envUrl.startsWith('https://');
  const isPlaceholder = envUrl.includes('your-project') || envKey.includes('your-anon-key');

  if (isValidUrl && envKey && !isPlaceholder) {
    return { url: envUrl, anonKey: envKey, isCustom: false };
  }

  return { url: '', anonKey: '', isCustom: false };
}

let activeClient: SupabaseClient | null = null;
const config = getStoredSupabaseConfig();
if (config.url && config.anonKey) {
  try {
    activeClient = createClient(config.url, config.anonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  return activeClient;
}

export function isRealSupabaseConnected(): boolean {
  return activeClient !== null;
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    if (!cleanUrl.startsWith('http')) return false;
    
    // Test creating client
    const testClient = createClient(cleanUrl, cleanKey);
    activeClient = testClient;
    localStorage.setItem(
      'taskflow_supabase_config',
      JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
    );
    return true;
  } catch (err) {
    console.error('Failed to configure custom Supabase:', err);
    return false;
  }
}

export function clearCustomSupabaseConfig() {
  localStorage.removeItem('taskflow_supabase_config');
  const envConf = getStoredSupabaseConfig();
  if (envConf.url && envConf.anonKey) {
    activeClient = createClient(envConf.url, envConf.anonKey);
  } else {
    activeClient = null;
  }
}

// Initial demo seed tasks generator for realistic experience
export function getInitialTasks(userId: string): Task[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inTwoDays = new Date(today);
  inTwoDays.setDate(inTwoDays.getDate() + 2);

  const inFiveDays = new Date(today);
  inFiveDays.setDate(inFiveDays.getDate() + 5);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 9);

  return [
    {
      id: 'task-1',
      user_id: userId,
      title: 'Review Q4 SaaS product roadmap and architecture',
      description: 'Align quarterly deliverables with customer feedback, focus on speed & database latency.',
      priority: 'HIGH',
      category: 'Work',
      due_date: today.toISOString(),
      completed: false,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'task-2',
      user_id: userId,
      title: 'Finalize Supabase schema migration and RLS policies',
      description: 'Ensure all authenticated user queries enforce auth.uid() = user_id boundary.',
      priority: 'HIGH',
      category: 'Projects',
      due_date: today.toISOString(),
      completed: true,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'task-3',
      user_id: userId,
      title: 'Submit quarterly tax documentation & receipt logs',
      description: 'Collate monthly statements, export invoices, and upload to accountant portal.',
      priority: 'HIGH',
      category: 'Personal',
      due_date: yesterday.toISOString(), // Overdue
      completed: false,
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
    {
      id: 'task-4',
      user_id: userId,
      title: 'Read System Design chapter on distributed consensus',
      description: 'Complete notes on Raft protocol vs Paxos and summarize key trade-offs.',
      priority: 'MEDIUM',
      category: 'Study',
      due_date: inTwoDays.toISOString(),
      completed: false,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'task-5',
      user_id: userId,
      title: 'Schedule weekly design sprint & team retro',
      description: 'Review interactive prototypes and gather engineering feasibility estimates.',
      priority: 'MEDIUM',
      category: 'Work',
      due_date: inFiveDays.toISOString(),
      completed: false,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'task-6',
      user_id: userId,
      title: 'Sign up for local weekend half-marathon run',
      description: 'Book registration slot and check morning packet pickup schedule.',
      priority: 'LOW',
      category: 'Personal',
      due_date: nextWeek.toISOString(),
      completed: false,
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'task-7',
      user_id: userId,
      title: 'Refactor Tailwind theme token palette for dark mode',
      description: 'Ensure WCAG AA contrast compliance across both light and deep navy themes.',
      priority: 'MEDIUM',
      category: 'Projects',
      due_date: inTwoDays.toISOString(),
      completed: true,
      created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ];
}

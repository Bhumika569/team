import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskPriority, TaskCategory, FilterState, SortOption, NotificationItem } from '../types';
import { useAuth } from './AuthContext';
import { getSupabaseClient, getInitialTasks } from '../lib/supabase';
import { isOverdue, isDueToday, isDueTomorrow, sortTasks } from '../lib/taskUtils';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  // CRUD
  createTask: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: TaskCategory;
    due_date: string | null;
  }) => Promise<Task>;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>
  ) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string) => Promise<Task>;
  // Filtering & Sorting
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  // Active Category Quick Filter
  selectedCategory: TaskCategory | 'ALL';
  setSelectedCategory: (cat: TaskCategory | 'ALL') => void;
  // Modal states
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  prefilledDueDate: string | null;
  setPrefilledDueDate: (dateStr: string | null) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  deletingTask: Task | null;
  setDeletingTask: (task: Task | null) => void;
  viewingTask: Task | null;
  setViewingTask: (task: Task | null) => void;
  // Stats
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  overdueCount: number;
  completionRate: number;
  categoryCounts: Record<TaskCategory, number>;
  priorityCounts: Record<TaskPriority, number>;
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  requestBrowserNotifications: () => Promise<boolean>;
  browserNotificationsEnabled: boolean;
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Data Export/Import
  exportTasksJSON: () => void;
  exportTasksCSV: () => void;
  resetToSampleTasks: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  priority: 'ALL',
  category: 'ALL',
  status: 'ALL',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>('smart');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'ALL'>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [prefilledDueDate, setPrefilledDueDate] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // Apply Theme to <html> classList
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Load tasks whenever authenticated user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const currentUserId = user.id;

    async function loadTasks(userId: string) {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();

      if (supabase) {
        try {
          const { data, error: sbError } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (sbError) {
            console.warn('Supabase tasks fetch warning, checking local storage:', sbError);
          } else if (data && data.length > 0) {
            setTasks(data as Task[]);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase fetch exception:', err);
        }
      }

      // Local storage fallback for this specific user
      const userTasksKey = `taskflow_tasks_${userId}`;
      const localData = localStorage.getItem(userTasksKey);

      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setTasks(parsed);
        } catch {
          const initial = getInitialTasks(userId);
          setTasks(initial);
          localStorage.setItem(userTasksKey, JSON.stringify(initial));
        }
      } else {
        // Seed initial tasks for this user
        const initial = getInitialTasks(userId);
        setTasks(initial);
        localStorage.setItem(userTasksKey, JSON.stringify(initial));
      }

      setLoading(false);
    }

    loadTasks(currentUserId);
  }, [user]);

  // Sync to local storage
  const persistTasks = useCallback((newTasks: Task[]) => {
    if (!user) return;
    const userTasksKey = `taskflow_tasks_${user.id}`;
    localStorage.setItem(userTasksKey, JSON.stringify(newTasks));
  }, [user]);

  // Compute Notifications from tasks
  useEffect(() => {
    if (!user || tasks.length === 0) {
      setNotifications([]);
      return;
    }

    const items: NotificationItem[] = [];

    tasks.forEach((t) => {
      if (t.completed) return;

      if (isOverdue(t)) {
        items.push({
          id: `notif-overdue-${t.id}`,
          title: 'Task Overdue',
          message: `"${t.title}" is overdue! Priority: ${t.priority}`,
          type: 'urgent',
          timestamp: t.due_date || t.created_at,
          read: false,
          taskId: t.id,
        });
      } else if (isDueToday(t)) {
        items.push({
          id: `notif-today-${t.id}`,
          title: 'Due Today',
          message: `"${t.title}" is due today. Give it your focus!`,
          type: 'due_today',
          timestamp: t.due_date || t.created_at,
          read: false,
          taskId: t.id,
        });
      } else if (isDueTomorrow(t)) {
        items.push({
          id: `notif-tomorrow-${t.id}`,
          title: 'Upcoming Deadline Tomorrow',
          message: `"${t.title}" is due tomorrow.`,
          type: 'upcoming',
          timestamp: t.due_date || t.created_at,
          read: false,
          taskId: t.id,
        });
      }
    });

    setNotifications(items);
  }, [tasks, user]);

  // CRUD Operations
  const createTask = async (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: TaskCategory;
    due_date: string | null;
  }): Promise<Task> => {
    if (!user) throw new Error('Must be logged in to create tasks');

    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substring(2, 11),
      user_id: user.id,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      priority: data.priority,
      category: data.category,
      due_date: data.due_date,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: inserted, error: sbError } = await supabase
          .from('tasks')
          .insert([newTask])
          .select()
          .single();

        if (inserted && !sbError) {
          const finalTask = inserted as Task;
          setTasks((prev) => {
            const next = [finalTask, ...prev];
            persistTasks(next);
            return next;
          });
          return finalTask;
        }
      } catch (err) {
        console.warn('Supabase task insert error, fallback to local:', err);
      }
    }

    setTasks((prev) => {
      const next = [newTask, ...prev];
      persistTasks(next);
      return next;
    });

    return newTask;
  };

  const updateTask = async (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>
  ): Promise<Task> => {
    if (!user) throw new Error('Must be logged in');

    let updatedResult: Task | null = null;
    const nowIso = new Date().toISOString();

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: updated, error: sbError } = await supabase
          .from('tasks')
          .update({ ...updates, updated_at: nowIso })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updated && !sbError) {
          updatedResult = updated as Task;
        }
      } catch (err) {
        console.warn('Supabase task update error:', err);
      }
    }

    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const patched = { ...t, ...updates, updated_at: nowIso };
          if (!updatedResult) updatedResult = patched;
          return patched;
        }
        return t;
      });
      persistTasks(next);
      return next;
    });

    if (!updatedResult) throw new Error('Task not found');
    return updatedResult;
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    if (!user) return false;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Supabase task delete error:', err);
      }
    }

    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistTasks(next);
      return next;
    });

    return true;
  };

  const toggleTaskCompletion = async (id: string): Promise<Task> => {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) throw new Error('Task not found');

    const nextCompleted = !existing.completed;

    if (nextCompleted) {
      // Trigger subtle celebration confetti for rewarding user flow
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981'],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore in non-browser or strict contexts
      }
    }

    return updateTask(id, { completed: nextCompleted });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedCategory('ALL');
  };

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const pendingCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const overdueCount = useMemo(() => tasks.filter((t) => isOverdue(t)).length, [tasks]);
  const completionRate = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [totalCount, completedCount]);

  const categoryCounts = useMemo(() => {
    const counts: Record<TaskCategory, number> = {
      Work: 0,
      Personal: 0,
      Study: 0,
      Projects: 0,
    };
    tasks.forEach((t) => {
      if (counts[t.category] !== undefined) {
        counts[t.category]++;
      }
    });
    return counts;
  }, [tasks]);

  const priorityCounts = useMemo(() => {
    const counts: Record<TaskPriority, number> = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++;
      }
    });
    return counts;
  }, [tasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    // Category filter (combined with selectedCategory from sidebar if applicable)
    const activeCategory = selectedCategory !== 'ALL' ? selectedCategory : filters.category;
    if (activeCategory !== 'ALL') {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Priority filter
    if (filters.priority !== 'ALL') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Status filter
    if (filters.status === 'COMPLETED') {
      result = result.filter((t) => t.completed);
    } else if (filters.status === 'PENDING') {
      result = result.filter((t) => !t.completed);
    } else if (filters.status === 'OVERDUE') {
      result = result.filter((t) => isOverdue(t));
    }

    return sortTasks(result, sortOption);
  }, [tasks, filters, selectedCategory, sortOption]);

  // Notifications read handlers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const requestBrowserNotifications = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setBrowserNotificationsEnabled(granted);
      if (granted) {
        new Notification('TaskFlow Notifications Enabled', {
          body: 'You will receive timely reminders for tasks due today and critical deadlines.',
          icon: '/favicon.ico',
        });
      }
      return granted;
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return false;
    }
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Export JSON
  const exportTasksJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const exportTasksCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Priority', 'Category', 'Due Date', 'Completed', 'Created At'];
    const rows = tasks.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.priority,
      t.category,
      t.due_date || '',
      t.completed ? 'TRUE' : 'FALSE',
      t.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taskflow-tasks-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Reset to sample tasks
  const resetToSampleTasks = () => {
    if (!user) return;
    const initial = getInitialTasks(user.id);
    setTasks(initial);
    persistTasks(initial);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        filters,
        setFilters,
        resetFilters,
        sortOption,
        setSortOption,
        selectedCategory,
        setSelectedCategory,
        isAddModalOpen,
        setIsAddModalOpen,
        prefilledDueDate,
        setPrefilledDueDate,
        editingTask,
        setEditingTask,
        deletingTask,
        setDeletingTask,
        viewingTask,
        setViewingTask,
        totalCount,
        completedCount,
        pendingCount,
        overdueCount,
        completionRate,
        categoryCounts,
        priorityCounts,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        requestBrowserNotifications,
        browserNotificationsEnabled,
        theme,
        toggleTheme,
        exportTasksJSON,
        exportTasksCSV,
        resetToSampleTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

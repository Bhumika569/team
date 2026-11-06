export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Projects';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  due_date: string | null; // ISO string
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
}

export type SortOption = 'smart' | 'due_date' | 'highest_priority' | 'recently_created';

export interface FilterState {
  search: string;
  priority: TaskPriority | 'ALL';
  category: TaskCategory | 'ALL';
  status: 'ALL' | 'PENDING' | 'COMPLETED' | 'OVERDUE';
}

export type AppRoute =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'tasks'
  | 'today'
  | 'upcoming'
  | 'calendar'
  | 'analytics'
  | 'settings';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'due_today' | 'upcoming' | 'info';
  timestamp: string;
  read: boolean;
  taskId?: string;
}

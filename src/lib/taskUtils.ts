import { Task, TaskPriority, TaskCategory, SortOption } from '../types';

/**
 * Check if a task is overdue (past due date and incomplete)
 */
export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.completed || !task.due_date) return false;
  const dueDate = new Date(task.due_date);
  // Compare against start of current day in local time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return dueDay.getTime() < today.getTime();
}

/**
 * Check if a task is due today
 */
export function isDueToday(task: Task, now: Date = new Date()): boolean {
  if (!task.due_date) return false;
  const dueDate = new Date(task.due_date);
  return (
    dueDate.getFullYear() === now.getFullYear() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getDate() === now.getDate()
  );
}

/**
 * Check if a task is due tomorrow
 */
export function isDueTomorrow(task: Task, now: Date = new Date()): boolean {
  if (!task.due_date) return false;
  const dueDate = new Date(task.due_date);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return (
    dueDate.getFullYear() === tomorrow.getFullYear() &&
    dueDate.getMonth() === tomorrow.getMonth() &&
    dueDate.getDate() === tomorrow.getDate()
  );
}

/**
 * Calculate the deadline urgency score
 * Overdue: 500
 * Due today: 400
 * Due within 2 days: 300
 * Due within 7 days: 200
 * Later deadlines: 100
 * No deadline: 50
 */
export function getDeadlineUrgency(task: Task, now: Date = new Date()): number {
  if (!task.due_date) return 50;

  const dueDate = new Date(task.due_date);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dueDayStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();

  const diffDays = Math.round((dueDayStart - todayStart) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 500; // Overdue
  if (diffDays === 0) return 400; // Due today
  if (diffDays <= 2) return 300; // Due within 2 days
  if (diffDays <= 7) return 200; // Due within 7 days
  return 100; // Later deadlines
}

/**
 * Calculate the Smart Priority Score:
 * Priority weight: High = 300, Medium = 200, Low = 100
 * Deadline urgency added
 * Incomplete tasks receive bonus, completed tasks penalized to group at bottom
 */
export function calculateSmartScore(task: Task, now: Date = new Date()): number {
  if (task.completed) {
    // Completed tasks appear at the bottom
    return -10000 + (task.priority === 'HIGH' ? 3 : task.priority === 'MEDIUM' ? 2 : 1);
  }

  const priorityWeight = task.priority === 'HIGH' ? 300 : task.priority === 'MEDIUM' ? 200 : 100;
  const urgencyWeight = getDeadlineUrgency(task, now);

  return priorityWeight + urgencyWeight;
}

/**
 * Sort tasks using selected sorting criteria
 */
export function sortTasks(tasks: Task[], sortOption: SortOption, now: Date = new Date()): Task[] {
  return [...tasks].sort((a, b) => {
    // Always keep completed tasks grouped separately if desired, or sort by option
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (sortOption === 'smart') {
      const scoreA = calculateSmartScore(a, now);
      const scoreB = calculateSmartScore(b, now);
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher score first
      }
      // Tie breaker: earliest due date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    }

    if (sortOption === 'due_date') {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }

    if (sortOption === 'highest_priority') {
      const weights: Record<TaskPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const diff = weights[b.priority] - weights[a.priority];
      if (diff !== 0) return diff;
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    }

    if (sortOption === 'recently_created') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    return 0;
  });
}

/**
 * Format due date for friendly human reading
 */
export function formatDueDate(dateStr: string | null, now: Date = new Date()): string {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays <= 6) return `In ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export const CATEGORY_CONFIG: Record<
  TaskCategory,
  { label: string; color: string; border: string; bg: string; darkBg: string; text: string }
> = {
  Work: {
    label: 'Work',
    color: '#3b82f6',
    border: 'border-blue-200 dark:border-blue-900/60',
    bg: 'bg-blue-50 text-blue-700',
    darkBg: 'dark:bg-blue-950/50 dark:text-blue-300',
    text: 'text-blue-600 dark:text-blue-400',
  },
  Personal: {
    label: 'Personal',
    color: '#10b981',
    border: 'border-emerald-200 dark:border-emerald-900/60',
    bg: 'bg-emerald-50 text-emerald-700',
    darkBg: 'dark:bg-emerald-950/50 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  Study: {
    label: 'Study',
    color: '#8b5cf6',
    border: 'border-purple-200 dark:border-purple-900/60',
    bg: 'bg-purple-50 text-purple-700',
    darkBg: 'dark:bg-purple-950/50 dark:text-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
  },
  Projects: {
    label: 'Projects',
    color: '#f59e0b',
    border: 'border-amber-200 dark:border-amber-900/60',
    bg: 'bg-amber-50 text-amber-700',
    darkBg: 'dark:bg-amber-950/50 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; badge: string; dotColor: string; textColor: string }
> = {
  HIGH: {
    label: 'High Priority',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dotColor: '#ef4444',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  MEDIUM: {
    label: 'Medium Priority',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
    dotColor: '#f59e0b',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  LOW: {
    label: 'Low Priority',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
    dotColor: '#10b981',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
};

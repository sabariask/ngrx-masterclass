import { createSelector } from '@ngrx/store';
import * as TodoSelectors from '../../features/todos/store/todo.selectors';
import * as AuthSelectors from '../auth/auth.selectors';

const selectProductivityScore = createSelector(
  TodoSelectors.selectCompletionRate,
  TodoSelectors.selectOverdueTodos,
  TodoSelectors.selectHighPriorityTodos,
  TodoSelectors.selectAllTodos,
  (completionRate, overdue, highPriority, all) => {
    if (!all.length) return 0;

    let score = (completionRate / 100) * 60;
    const overduePenalty = Math.min(overdue.length * 5, 30);
    score -= overduePenalty;

    const urgencyPenalty = Math.min(highPriority.length * 3, 30);
    score -= urgencyPenalty;

    score += 40;

    return Math.max(0, Math.min(100, Math.round(score)));
  },
);

// Productivity Label
const selectProductivityLabel = createSelector(selectProductivityScore, (score) => {
  if (score >= 80)
    return {
      label: 'Excellent',
      color: '#4caf50',
    };
  if (score >= 60) return { label: 'Good', color: '#8bc34a' };
  if (score >= 40) return { label: 'Fair', color: '#ff9800' };
  return { label: 'Need Works', color: '#e94560' };
});

// Weekly Progress
const selectWeeklyProgress = createSelector(TodoSelectors.selectAllTodos, (todos) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (today.getDay() - index));
    const dateStr = date.toISOString().split('T')[0];
    const dayTodos = todos.filter((t) => t.createdAt.startsWith(dateStr));
    return {
      day,
      date: dateStr,
      total: dayTodos.length,
      completed: dayTodos.filter((t) => t.completed).length,
    };
  });
  return weekData;
});

// Full Analytics ViewModel
export const selectAnalyticsViewModel = createSelector(
  AuthSelectors.selectAuthUser,
  TodoSelectors.selectTodosCount,
  TodoSelectors.selectCompletionRate,
  TodoSelectors.selectOverdueTodos,
  TodoSelectors.selectTodoDueToday,
  TodoSelectors.selectHighPriorityTodos,
  TodoSelectors.selectPriorityBreakdown,
  selectProductivityScore,
  selectProductivityLabel,
  selectWeeklyProgress,
  (
    user,
    counts,
    completionRate,
    overdueTodos,
    todayTodos,
    urgentTodos,
    priorityBreakdown,
    productivityScore,
    productivityLabel,
    weeklyProgress,
  ) => ({
    user,
    counts,
    completionRate,
    overdueTodos,
    todayTodos,
    urgentTodos,
    priorityBreakdown,
    productivityScore,
    productivityLabel,
    weeklyProgress,
    greeting: `Hello, ${user?.name ?? 'Guest'}! 👋`,
    hasOverdue: overdueTodos.length > 0,
    hasDueToday: todayTodos.length > 0,
    isAllDone: counts.total > 0 && counts.pending === 0,
  }),
);

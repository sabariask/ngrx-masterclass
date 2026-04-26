import { createSelector } from '@ngrx/store';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as TodoSelectors from '../../features/todos/store/todo.selectors';
import { AppState } from '../app.state';

export const selectDashboardViewModel = createSelector(
  TodoSelectors.selectAllTodos,
  TodoSelectors.selectTodosLoading,
  AuthSelectors.selectAuthUser,
  AuthSelectors.selectIsAdmin,
  (todos, loading, user, isAdmin) => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const high = todos.filter((t) => t.priority === 'high').length;
    const pending = todos.filter((t) => !t.completed).length;
    return {
      user,
      isAdmin,
      loading,
      counts: {
        total,
        completed,
        pending,
        high,
      },
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      highPriorityTodos: todos.filter((t) => t.priority === 'high' && !t.completed),
      greeting: `Hello, ${user?.name ?? 'Guest'}!`,
    };
  },
);

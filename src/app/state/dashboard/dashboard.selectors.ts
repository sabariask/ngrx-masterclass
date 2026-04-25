import { createSelector } from '@ngrx/store';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { AppState } from '../app.state';

export const selectDashboardViewModel = createSelector(
  (state: AppState) => state,
  AuthSelectors.selectAuthUser,
  AuthSelectors.selectIsAdmin,
  (state, user, isAdmin) => ({
    user,
    isAdmin,
    counts: state.todos
      ? {
          total: state.todos.todos.length,
          completed: state.todos.todos.filter((t) => t.completed).length,
          pending: state.todos.todos.filter((t) => !t.completed).length,
          high: state.todos.todos.filter((t) => t.priority === 'high').length,
        }
      : {
          total: 0,
          completed: 0,
          pending: 0,
          high: 0,
        },
    completionRate: state.todos?.todos
      ? Math.round(
          (state.todos?.todos.filter((t) => t.completed).length / state.todos?.todos.length) * 100,
        )
      : 0,
    highPriorityTodos: state.todos?.todos.filter((t) => t.priority === 'high' && !t.completed),
    loading: state.todos?.loading ?? false,
    greeting: `Hello, ${user?.name ?? 'Guest'}!`,
  }),
);

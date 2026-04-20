import { createSelector } from "@ngrx/store";
import * as AuthSelectors from '../../state/auth/auth.selectors';
import * as TodoSelectors from '../../state/todos/todo.selectors';


export const selectDashboardViewModel = createSelector(
    AuthSelectors.selectAuthUser,
    AuthSelectors.selectIsAdmin,
    TodoSelectors.selectTodosCount,
    TodoSelectors.selectCompletionRate,
    TodoSelectors.selectHighPriorityTodos,
    TodoSelectors.selectTodosLoading,
    (user, isAdmin, counts, completionRate, highPriorityTodos, loading) => ({
        user,
        isAdmin,
        counts,
        completionRate,
        highPriorityTodos,
        loading,
        greeting: `Hello, ${user?.name ?? 'Guest'}!`
    })
)
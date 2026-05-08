import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, TodoState } from './todo.state';

// Feature selector
export const selectTodoState = createFeatureSelector<TodoState>('todos');

// Entity selectors
export const selectAllTodos = createSelector(selectTodoState, (state) => {
  if (!state) return [];
  console.log('selectAllTodos state:', state);
  return adapter.getSelectors().selectAll(state);
});

export const selectTodosIds = createSelector(selectTodoState, (state) => {
  if (!state) return [];
  return adapter.getSelectors().selectIds(state);
});

export const selectTodosEntities = createSelector(selectTodoState, (state) => {
  if (!state) return {};
  return adapter.getSelectors().selectEntities(state);
});

export const selectTotalTodos = createSelector(selectTodoState, (state) => {
  if (!state) return 0;
  return adapter.getSelectors().selectTotal(state);
});

export const selectTodosLoading = createSelector(
  selectTodoState,
  (state) => state?.loading ?? false,
);

export const selectTodosError = createSelector(selectTodoState, (state) => state?.error ?? '');

export const selectSelectedId = createSelector(selectTodoState, (state) => state?.selectedId ?? 0);

export const selectTodosFilter = createSelector(selectTodoState, (state) => state?.filter ?? 'all');

// Dervied selectors
export const selectCompletedTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((t) => t.completed),
);

export const selectPendingTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((t) => !t.completed),
);

export const selectHighPriorityTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((t) => t.priority === 'high' && !t.completed),
);

export const selectMediumPriorityTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((t) => t.priority === 'medium' && !t.completed),
);

export const selectTodosCount = createSelector(selectAllTodos, (todos) => ({
  total: todos.length,
  completed: todos.filter((t) => t.completed).length,
  pending: todos.filter((t) => !t.completed).length,
  high: todos.filter((t) => t.priority === 'high').length,
  medium: todos.filter((t) => t.priority === 'medium').length,
  low: todos.filter((t) => t.priority === 'low').length,
}));

export const selectCompletionRate = createSelector(selectAllTodos, (todos): number => {
  const done = todos.filter((t) => t.completed).length;
  return Math.round((done / todos.length) * 100);
});

// Grouping selectors
export const selectTodosGroupByPriority = createSelector(selectAllTodos, (todos) => ({
  high: todos.filter((t) => t.priority === 'high'),
  medium: todos.filter((t) => t.priority === 'medium'),
  low: todos.filter((t) => t.priority === 'low'),
}));

// export const selectTodoById = (id: number) =>
//   createSelector(selectAllTodos, (todos) => todos.find((t) => Number(t.id) === id) ?? null);

export const selectTodosByPriority = (priority: 'low' | 'medium' | 'high') =>
  createSelector(selectAllTodos, (todos) => todos.filter((t) => t.priority === priority));

// Filtered selectors
export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectTodosFilter,
  (todos, filter) => {
    switch (filter) {
      case 'pending':
        return todos.filter((t) => !t.completed);
      case 'high':
        return todos.filter((t) => t.priority === 'high');
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  },
);

export const selectSelectedTodo = createSelector(
  selectTodosEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? (entities[selectedId] ?? null) : null),
);

// Level 3: Overdue todos
export const selectOverdueTodos = createSelector(selectAllTodos, (todos) => {
  const today = new Date().toISOString().split('T')[0];
  return todos.filter((t) => t.dueDate && t.dueDate < today && !t.completed);
});

// Level 3: Todos due today
export const selectTodoDueToday = createSelector(selectAllTodos, (todos) => {
  const today = new Date().toISOString().split('T')[0];
  return todos.filter((t) => t.dueDate === today && !t.completed);
});

export const selectPriorityBreakdown = createSelector(selectAllTodos, (todos) => {
  if (!todos.length) return { high: 0, medium: 0, low: 0 };
  const total = todos.length;
  return {
    high: Math.round((todos.filter((t) => t.priority === 'high').length / total) * 100),
    medium: Math.round((todos.filter((t) => t.priority === 'medium').length / total) * 100),
    low: Math.round((todos.filter((t) => t.priority === 'low').length / total) * 100),
  };
});

// Level 5: priority breakdown selectors
export const selectTodoById = (id: number) =>
  createSelector(selectTodosEntities, (entities) => entities[id] ?? null);

export const selectTodosCompletedAfter = (date: string) =>
  createSelector(selectCompletedTodos, (todos) => todos.filter((t) => t.createdAt >= date));

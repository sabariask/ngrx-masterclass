import { createReducer, on } from '@ngrx/store';
import { adapter, initialTodoState } from './todo.state';
import { TodoActions } from './todo.actions';

export const todoReducer = createReducer(
  initialTodoState,
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) =>
    adapter.setAll(todos, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Todo
  on(TodoActions.addTodo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodoActions.addTodoSuccess, (state, { todo }) =>
    adapter.addOne(todo, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(TodoActions.addTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Delete Todo
  on(TodoActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Toggle todo
  on(TodoActions.toggleTodo, (state, { id, completed }) =>
    adapter.updateOne({ id, changes: { completed: !completed } }, { ...state, error: null }),
  ),
  on(TodoActions.toggleTodoSuccess, (state) => ({
    ...state,
  })),
  on(TodoActions.toggleTodoFailure, (state, { id, previousCompleted, error }) =>
    adapter.updateOne({ id, changes: { completed: previousCompleted } }, { ...state, error }),
  ),

  //Clear All
  on(TodoActions.clearAllTodos, (state) =>
    adapter.removeAll({
      ...state,
      error: null,
    }),
  ),

  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter,
  })),

  on(TodoActions.selectTodo, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),

  on(TodoActions.updateTodoTitle, (state, { id, title }) =>
    adapter.updateOne({ id, changes: { title } }, { ...state, error: null }),
  ),

  on(TodoActions.updateTodoTitileSuccess, (state) => ({
    ...state,
  })),

  on(TodoActions.updateTodoTitileFailure, (state, { id, previousTitle, error }) =>
    adapter.updateOne({ id, changes: { title: previousTitle } }, { ...state, error }),
  ),
);

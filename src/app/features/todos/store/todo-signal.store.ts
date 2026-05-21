import { computed, inject } from '@angular/core';
import { Todo } from '../../../models/todo.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TodoService } from '../../../services/todo.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';

interface TodoSignalState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed' | 'high';
}

const initialState: TodoSignalState = {
  todos: [],
  loading: false,
  error: null,
  filter: 'all',
};

export const TodoSignalStore = signalStore(
  { providedIn: 'root' },
  withEntities<Todo>(),
  withState(initialState),
  withComputed((store) => ({
    completedTodos: computed(() => store.entities().filter((t) => t.completed)),
    pendingTodos: computed(() => store.entities().filter((t) => !t.completed)),
    highPriorityTodos: computed(() =>
      store.entities().filter((t) => t.priority === 'high' && !t.completed),
    ),
    todosCount: computed(() => ({
      total: store.entities().length,
      completed: store.entities().filter((t) => t.completed).length,
      pending: store.entities().filter((t) => !t.completed).length,
      high: store.entities().filter((t) => t.priority === 'high').length,
    })),
    completionRate: computed(() => {
      const todos = store.entities();
      if (!todos.length) return 0;
      const done = todos.filter((t) => t.completed).length;
      return Math.round((done / todos.length) * 100);
    }),
    filteredTodos: computed(() => {
      const todos = store.entities();
      const filter = store.filter();
      switch (filter) {
        case 'pending':
          return todos.filter((t) => !t.completed);
        case 'completed':
          return todos.filter((t) => t.completed);
        case 'high':
          return todos.filter((t) => t.priority === 'high');
        default:
          return todos;
      }
    }),
  })),
  withMethods((store, todoService = inject(TodoService)) => ({
    setFilter(filter: TodoSignalState['filter']): void {
      patchState(store, { filter });
    },
    toggleTodoOptimistic(id: number): void {
      const todos = store.entities();
      const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      patchState(store, { todos: updated });
    },
    rollbackToggle(id: number, previousCompleted: boolean): void {
      const todos = store.entities();
      const rolled = todos.map((t) => (t.id === id ? { ...t, completed: previousCompleted } : t));
      patchState(store, { todos: rolled, error: 'Toggle failed, reverted' });
    },
    clearError(): void {
      patchState(store, { error: null });
    },
    loadTodos: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          todoService.getAllTodos().pipe(
            tapResponse({
              next: (todos) => patchState(store, setAllEntities(todos), { loading: false }),
              error: (err: any) =>
                patchState(store, {
                  loading: false,
                  error: err.message ?? 'Failed to load',
                }),
            }),
          ),
        ),
      ),
    ),
    addTodo: rxMethod<{
      title: string;
      priority: 'low' | 'medium' | 'high';
    }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ title, priority }) =>
          todoService
            .addTodo({
              title,
              priority,
              completed: false,
              userId: 1,
            })
            .pipe(
              tapResponse({
                next: (todo) =>
                  patchState(store, addEntity(todo), {
                    loading: false,
                  }),
                error: (err: any) =>
                  patchState(store, {
                    loading: false,
                    error: err.message ?? 'Failed to add',
                  }),
              }),
            ),
        ),
      ),
    ),
    deleteTodo: rxMethod<number>(
      pipe(
        switchMap((id) =>
          todoService.deleteTodo(id).pipe(
            tapResponse({
              next: () => patchState(store, removeEntity(id)),
              error: (err: any) =>
                patchState(store, {
                  error: err.message ?? 'Failed to delete',
                }),
            }),
          ),
        ),
      ),
    ),
    toggleTodo: rxMethod<{
      id: number;
      completed: boolean;
    }>(
      pipe(
        switchMap(({ id, completed }) => {
          const previous = completed;
          const todos = store
            .entities()
            .map((t) => (t.id === id ? { ...t, completed: !completed } : t));
          patchState(store, { todos });

          return todoService.toggleTodo(id, !completed).pipe(
            tapResponse({
              next: (updated) => {
                patchState(store, updateEntity({ id, changes: { completed: updated.completed } }));
              },
              error: (err: any) => {
                const rolledBack = store
                  .entities()
                  .map((t) => (t.id === id ? { ...t, completed: previous } : t));
                patchState(store, {
                  todos: rolledBack,
                  error: 'Toggle failed, reverted',
                });
              },
            }),
          );
        }),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit() {
      console.log('TodoSignalStore initialized');
      store.loadTodos();
    },
    onDestroy() {
      console.log('TodoSignalStore destroyed');
    },
  })),
);

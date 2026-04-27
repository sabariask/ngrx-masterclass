import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoActions } from './todo.actions';
import {
  catchError,
  delay,
  filter,
  map,
  mergeMap,
  of,
  retryWhen,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastService } from '../../../services/toast.service';
import { TodoService } from '../../../services/todo.service';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { selectTodoIdFromRoute } from '../../../store/router/router.selectors';

@Injectable()
export class TodoEffects {
  actions$ = inject(Actions);
  todoService = inject(TodoService);
  toast = inject(ToastService);
  store = inject(Store);

  loadTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.todoService.getMockTodos().pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          catchError((error) => {
            const message = this.getErrorMessage(error);
            return of(TodoActions.loadTodosFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  loadTodoFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.loadTodosFailure),
        tap(({ error }) => this.toast.error(`Error to load todos: ${error}`)),
      ),
    { dispatch: false },
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(({ title, priority, description }) =>
        this.todoService
          .addTodo({
            title,
            priority,
            description,
            completed: false,
            userId: 1,
          })
          .pipe(
            map(
              (todo) => TodoActions.addTodoSuccess({ todo }),
              catchError((error) =>
                of(
                  TodoActions.addTodoFailure({
                    error: this.getErrorMessage(error),
                  }),
                ),
              ),
            ),
          ),
      ),
    ),
  );

  addTodoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.addTodoSuccess),
        tap(({ todo }) => this.toast.success(`"${todo.title}" added successfully!`)),
      ),
    { dispatch: false },
  );

  addTodoFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.addTodoFailure),
        tap(({ error }) => this.toast.error(`Failed to add todo: ${error}`)),
      ),
    { dispatch: false },
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError((error) =>
            of(
              TodoActions.deleteTodoFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteTodoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.deleteTodoSuccess),
        tap(() => this.toast.success('Todo deleted!')),
      ),
    { dispatch: false },
  );

  deleteTodoFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.deleteTodoFailure),
        tap(({ error }) => this.toast.error(`Delete failed: ${error}`)),
      ),
    { dispatch: false },
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(({ id, completed }) =>
        this.todoService.toggleTodo(id, !completed).pipe(
          map((updated) =>
            TodoActions.toggleTodoSuccess({ id: updated.id, completed: updated.completed }),
          ),
          catchError((error) =>
            of(
              TodoActions.toggleTodoFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  toggleTodoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.toggleTodoSuccess),
        tap(({ completed }) =>
          this.toast.success(completed ? 'Task completed! 🎉' : 'Task marked as pending'),
        ),
      ),
    { dispatch: false },
  );

  loadTodoWithRetry$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App] Init Load'),
      switchMap(() =>
        this.todoService.getAllTodos().pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          retryWhen((errors) =>
            errors.pipe(
              delay(2000),
              take(3),
              tap((err) =>
                console.warn('Retrying to load todos after error:', this.getErrorMessage(err)),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  loadTodoOnRouteChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(selectTodoIdFromRoute)),
      filter(([, id]) => id != null),
      map(([, id]) => TodoActions.selectTodo({ id: id! })),
    ),
  );

  private getErrorMessage(error: any): string {
    if (error.name === 'TimeoutError') {
      return 'Request timed out. Please check your connection.';
    }

    if (error.status) {
      switch (error.status) {
        case 0:
          return 'No internet connection.';
        case 400:
          return 'Bad request. Please check your input.';
        case 401:
          return 'Unauthorized. Please login again.';
        case 403:
          return 'You do not have the permission';
        case 404:
          return 'Resource not found';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'Http Error ${error.status}';
      }
    }
    return error.message ?? 'An unexpected error occurred.';
  }
}

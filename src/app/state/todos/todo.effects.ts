import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../../services/todo.service';
import { TodoActions } from './todo.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

@Injectable()
export class TodoEffects {
  actions$ = inject(Actions);
  todoService = inject(TodoService);

  loadTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.todoService.getMockTodos().pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          catchError((error) =>
            of(
              TodoActions.loadTodosFailure({
                error: error.message ?? 'Failed to load todo',
              }),
            ),
          ),
        ),
      ),
    ),
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
                    error: error.message ?? 'Failed to add todo',
                  }),
                ),
              ),
            ),
          ),
      ),
    ),
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
                error: error.message ?? 'Failed to delete todo',
              }),
            ),
          ),
        ),
      ),
    ),
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
                error: error.message ?? 'Failed to toggle todo',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

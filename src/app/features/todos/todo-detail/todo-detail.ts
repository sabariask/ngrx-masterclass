import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { Store } from '@ngrx/store';
import * as TodoSelectors from '../store/todo.selectors';
import { selectTodoIdFromRoute } from '../../../store/router/router.selectors';
import { TodoActions } from '../store/todo.actions';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-todo-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './todo-detail.html',
  styleUrl: './todo-detail.scss',
  standalone: true,
})
export class TodoDetail {
  todo$!: Observable<Todo | null>;
  loading$!: Observable<boolean>;

  store = inject(Store);

  constructor() {
    this.todo$ = this.store.select(selectTodoIdFromRoute).pipe(
      filter((id) => id !== null),
      switchMap((id) => this.store.select(TodoSelectors.selectTodoById(id!))),
    );

    this.loading$ = this.store.select(TodoSelectors.selectTodosLoading);
  }

  toggleTodo(todo: Todo) {
    this.store.dispatch(
      TodoActions.toggleTodo({
        id: todo.id,
        completed: todo.completed,
      }),
    );
  }

  deleteTodo(id: number) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}

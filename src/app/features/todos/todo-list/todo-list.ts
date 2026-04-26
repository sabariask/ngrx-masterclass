import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { AppState } from '../../../state/app.state';
import { Store } from '@ngrx/store';
import * as TodoSelectors from '../../../features/todos/store/todo.selectors';
import { TodoActions } from '../../../features/todos//store/todo.actions';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoItem],
  standalone: true,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit {
  filteredTodos$!: Observable<Todo[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  counts$!: Observable<{ total: number; completed: number; pending: number; high: number }>;
  activeFilter$!: Observable<string>;

  newTitle = '';
  newPriority: 'low' | 'medium' | 'high' = 'medium';
  newDescription = '';

  store = inject(Store<AppState>);

  constructor() {
    this.filteredTodos$ = this.store.select(TodoSelectors.selectFilteredTodos);
    this.loading$ = this.store.select(TodoSelectors.selectTodosLoading);
    this.counts$ = this.store.select(TodoSelectors.selectTodosCount);
    this.error$ = this.store.select(TodoSelectors.selectTodosError);
    this.activeFilter$ = this.store.select(TodoSelectors.selectTodosFilter);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(): void {
    if (!this.newTitle.trim()) return;

    this.store.dispatch(
      TodoActions.addTodo({
        title: this.newTitle.trim(),
        priority: this.newPriority,
        description: this.newDescription,
      }),
    );

    this.newTitle = '';
    this.newPriority = 'medium';
  }

  toggleTodo(todo: Todo): void {
    this.store.dispatch(TodoActions.toggleTodo({ id: todo.id, completed: todo.completed }));
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  clearAll(): void {
    this.store.dispatch(TodoActions.clearAllTodos());
  }

  setFilter(filter: 'all' | 'pending' | 'high' | 'completed'): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  trackByTodoId(index: number, toto: Todo) {
    return toto.id;
  }
}

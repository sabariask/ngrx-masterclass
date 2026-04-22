import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import * as TodoSelectors from '../../state/todos/todo.selectors';
import { TodoActions } from '../../state/todos/todo.actions';
import { FormsModule } from '@angular/forms';
import { TodoItem } from "../todo-item/todo-item";

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoItem],
  standalone: true,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit {
  todos$!: Observable<Todo[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  count$!: Observable<{ total: number; completed: number; pending: number; high: number }>

  newTitle = '';
  newPriority: 'low' | 'medium' | 'high' = 'medium';
  filterType = 'all';

  store = inject(Store<AppState>);

  constructor() {
    this.todos$ = this.store.select(TodoSelectors.selectAllTodos);
    this.loading$ = this.store.select(TodoSelectors.selectTodosLoading);
    this.count$ = this.store.select(TodoSelectors.selectTodosCount);
    this.error$ = this.store.select(TodoSelectors.selectTodosError);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(): void {
    if(!this.newTitle.trim()) return;

    this.store.dispatch(TodoActions.addTodo({
      title: this.newTitle.trim(),
      priority: this.newPriority
    }));

    this.newTitle = '';
    this.newPriority = 'medium';
  }

  toggleTodo(todo: Todo): void {
    this.store.dispatch(TodoActions.toggleTodo(todo));
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  clearAll(): void {
    this.store.dispatch(TodoActions.clearAllTodos());
  }


  setFilter(filter: string): void {
    this.filterType = filter;

    switch(filter) {
      case 'pending':
        this.todos$ = this.store.select(TodoSelectors.selectPendingTodos);
        break;
      case 'completed':
        this.todos$ = this.store.select(TodoSelectors.selectCompletedTodos);
        break;
      case 'high':
        this.todos$ = this.store.select(TodoSelectors.selectHighPriorityTodos);
        break;
      default:
        this.todos$ = this.store.select(TodoSelectors.selectAllTodos);
    }
  }

  trackByTodoId(index: number, toto: Todo) {
    return toto.id;
  }
}

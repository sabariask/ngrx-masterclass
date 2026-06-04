import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import * as Selectors from '../todos/store/todo.selectors';
import { TodoActions } from './store/todo.actions';
import { RedoAction, UndoAction } from '../../store/meta-reducer';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  private readonly store = inject(Store);

  allTodos$: Observable<Todo[]> = this.store.select(Selectors.selectAllTodos);
  filteredTodos$: Observable<Todo[]> = this.store.select(Selectors.selectFilteredTodos);
  loading$: Observable<boolean> = this.store.select(Selectors.selectTodosLoading);
  error$: Observable<string | null> = this.store.select(Selectors.selectTodosError);
  counts$ = this.store.select(Selectors.selectTodosCount);
  completionRate$: Observable<number> = this.store.select(Selectors.selectCompletionRate);
  filter$ = this.store.select(Selectors.selectTodosFilter);
  overdueTodos$: Observable<Todo[]> = this.store.select(Selectors.selectOverdueTodos);
  highPriority$: Observable<Todo[]> = this.store.select(Selectors.selectHighPriorityTodos);
  completedTodos$: Observable<Todo[]> = this.store.select(Selectors.selectCompletedTodos);

  getTodoById$(id: number): Observable<Todo | null> {
    return this.store.select(Selectors.selectTodoById(id));
  }

  loadTodos(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodos(title: string, priority: 'low' | 'medium' | 'high', description: string): void {
    this.store.dispatch(TodoActions.addTodo({ title, priority, description }));
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  toggleTodo(todo: Todo) {
    this.store.dispatch(
      TodoActions.toggleTodo({
        id: todo.id,
        completed: todo.completed,
      }),
    );
  }

  updateTodoTitle(id: number, title: string) {
    this.store.dispatch(
      TodoActions.updateTodoTitle({
        id,
        title,
      }),
    );
  }

  setFilter(filter: 'all' | 'pending' | 'completed' | 'high') {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  clearAllTodos() {
    this.store.dispatch(TodoActions.clearAllTodos());
  }

  undo() {
    this.store.dispatch(UndoAction);
  }

  redo() {
    this.store.dispatch(RedoAction);
  }
}

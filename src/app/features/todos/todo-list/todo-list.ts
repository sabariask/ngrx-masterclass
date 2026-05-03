import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { AppState } from '../../../state/app.state';
import { Store } from '@ngrx/store';
import * as TodoSelectors from '../../../features/todos/store/todo.selectors';
import { TodoActions } from '../../../features/todos//store/todo.actions';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { TodoPaginationStore } from '../store/todo-pagination.store';
import { FilterState, TodoFilterStore } from '../store/todo-filter.store';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoItem],
  standalone: true,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  providers: [TodoPaginationStore, TodoFilterStore],
})
export class TodoList implements OnInit {
  newTitle = '';
  newPriority: 'low' | 'medium' | 'high' = 'medium';
  newDescription = '';

  store = inject(Store<AppState>);

  paginationStore = inject(TodoPaginationStore);
  filterStore = inject(TodoFilterStore);

  allTodos$ = this.store.select(TodoSelectors.selectAllTodos);

  // Global Store
  loading$ = this.store.select(TodoSelectors.selectTodosLoading);
  counts$ = this.store.select(TodoSelectors.selectTodosCount);
  error$ = this.store.select(TodoSelectors.selectTodosError);

  filterState$ = this.filterStore.filterState$;
  showFilters$ = this.filterStore.showFilters$;
  hasActiveFilterCount$ = this.filterStore.hasActiveFilters$;
  activeFilterCount$ = this.filterStore.activeFilterCount$;
  paginationVm$ = this.paginationStore.vm$;
  suggestion$ = this.filterStore.suggestion$;
  suggestionLoading$ = this.filterStore.suggestLoading$;

  filteredPaginatedTodos$!: Observable<any>;

  constructor() {
    this.filteredPaginatedTodos$ = combineLatest([
      this.allTodos$,
      this.filterStore.filterState$,
      this.paginationStore.paginationInfo$,
    ]).pipe(
      map(([todos, filters, pagination]) => {
        let filtered = todos;

        if (filters.searchText) {
          filtered = filtered.filter((t) =>
            t.title.toLowerCase().includes(filters.searchText.toLowerCase()),
          );
        }

        if (filters.priority !== 'all') {
          filtered = filtered.filter((t) => t.priority === filters.priority);
        }

        if (filters.status !== 'all') {
          filtered = filtered.filter((t) =>
            filters.status === 'completed' ? t.completed : !t.completed,
          );
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / pagination.pageSize);
        const items = filtered.slice(pagination.startIndex, pagination.endIndex);

        return {
          items,
          totalItems,
          totalPages,
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          hasNext: pagination.currentPage < totalPages,
          hasPrev: pagination.currentPage > 1,
        };
      }),
    );
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

  updateTodoTitle(event: { id: number; title: string }) {
    this.store.dispatch(
      TodoActions.updateTodoTitle({
        id: event.id,
        title: event.title,
      }),
    );
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

  onSearch(text: string) {
    this.filterStore.setSearchText(text);
    this.filterStore.searchEffect(text);
    this.paginationStore.setPage(1);
  }

  onPriorityFilter(priority: FilterState['priority']) {
    this.filterStore.setPriority(priority);
    this.paginationStore.setPage(1);
  }

  onStatusFilter(status: FilterState['status']) {
    this.filterStore.setStatus(status);
    this.paginationStore.setPage(1);
  }

  onPageChange(page: number) {
    this.paginationStore.setPage(page);
  }

  onNextPage() {
    this.paginationStore.nextPage();
  }

  onPrevPage() {
    this.paginationStore.prevPage();
  }

  clearFilters() {
    this.filterStore.clearAllFilters();
    this.paginationStore.resetPagination();
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { TodoPaginationStore } from '../store/todo-pagination.store';
import { FilterState, TodoFilterStore } from '../store/todo-filter.store';
import { TodoFacade } from '../todo.facade';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoItem],
  standalone: true,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  providers: [TodoPaginationStore, TodoFilterStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoList implements OnInit {
  newTitle = '';
  newPriority: 'low' | 'medium' | 'high' = 'medium';
  newDescription = '';

  todoFacade = inject(TodoFacade);

  paginationStore = inject(TodoPaginationStore);
  filterStore = inject(TodoFilterStore);

  allTodos$ = this.todoFacade.allTodos$.pipe(distinctUntilChanged());

  // Global Store
  loading$ = this.todoFacade.loading$;
  counts$ = this.todoFacade.counts$;
  error$ = this.todoFacade.error$;

  filterState$ = this.filterStore.filterState$;
  showFilters$ = this.filterStore.showFilters$;
  hasActiveFilterCount$ = this.filterStore.hasActiveFilters$;
  activeFilterCount$ = this.filterStore.activeFilterCount$;
  paginationVm$ = this.paginationStore.vm$;
  suggestion$ = this.filterStore.suggestion$;
  suggestionLoading$ = this.filterStore.suggestLoading$;

  filteredPaginatedTodos$!: Observable<any>;

  completionRate$ = this.todoFacade.completionRate$.pipe(distinctUntilChanged());

  checkCounts$ = this.todoFacade.counts$.pipe(
    distinctUntilChanged(
      (prev, curr) =>
        prev.total === curr.total &&
        prev.completed === curr.completed &&
        prev.pending === curr.pending,
    ),
  );

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
    this.todoFacade.loadTodos();
  }

  addTodo(): void {
    if (!this.newTitle.trim()) return;

    this.todoFacade.addTodos(this.newTitle.trim(), this.newPriority, this.newDescription);

    this.newTitle = '';
    this.newPriority = 'medium';
    this.newDescription = '';
  }

  updateTodoTitle(event: { id: number; title: string }) {
    this.todoFacade.updateTodoTitle(event.id, event.title);
  }

  toggleTodo(todo: Todo): void {
    this.todoFacade.toggleTodo(todo);
  }

  deleteTodo(id: number): void {
    this.todoFacade.deleteTodo(id);
  }

  clearAll(): void {
    this.todoFacade.clearAllTodos();
  }

  setFilter(filter: 'all' | 'pending' | 'high' | 'completed'): void {
    this.todoFacade.setFilter(filter);
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

  undo(): void {
    this.todoFacade.undo();
  }

  redo(): void {
    this.todoFacade.redo();
  }

  clearFilters() {
    this.filterStore.clearAllFilters();
    this.paginationStore.resetPagination();
  }
}

import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Todo } from '../../../models/todo.model';
import { debounceTime, distinctUntilChanged, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { TodoService } from '../../../services/todo.service';
import { tapResponse } from '@ngrx/operators';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  sortBy: 'createdAt' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
  totalCount: number;
}

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: 5,
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'asc',
  totalCount: 0,
};

@Injectable()
export class TodoPaginationStore extends ComponentStore<PaginationState> {
  todoService = inject(TodoService);

  constructor() {
    super(initialState);

    this.loadInitialData();
  }

  private loadInitialData = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.todoService.getAllTodos().pipe(
          tapResponse(
            (todos) => this.setTotalCount(todos.length),
            (error) => console.error(error),
          ),
        ),
      ),
    ),
  );

  readonly currentPage$ = this.select((state) => state.currentPage);

  readonly pageSize$ = this.select((state) => state.pageSize);

  readonly searchQuery$ = this.select((state) => state.searchQuery);

  readonly sortBy$ = this.select((state) => state.sortBy);

  readonly sortOrder$ = this.select((state) => state.sortOrder);

  readonly totalCount$ = this.select((state) => state.totalCount);

  readonly totalPages$ = this.select(this.totalCount$, this.pageSize$, (total, size) =>
    Math.ceil(total / size),
  );

  readonly paginationInfo$ = this.select(
    this.currentPage$,
    this.pageSize$,
    (currentPage, pageSize) => ({
      currentPage,
      pageSize,
      startIndex: (currentPage - 1) * pageSize,
      endIndex: currentPage * pageSize,
    }),
  );

  readonly vm$ = this.select(
    this.currentPage$,
    this.pageSize$,
    this.totalCount$,
    this.totalPages$,
    this.searchQuery$,
    this.sortBy$,
    this.sortOrder$,
    (currentPage, pageSize, totalCount, totalPages, searchQuery, sortBy, sortOrder) => ({
      currentPage,
      pageSize,
      totalCount,
      totalPages,
      searchQuery,
      sortBy,
      sortOrder,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    }),
  );

  readonly setPage = this.updater((state, page: number) => ({
    ...state,
    currentPage: page,
  }));

  readonly setPageSize = this.updater((state, pageSize: number) => ({
    ...state,
    pageSize,
    currentPage: 1,
  }));

  readonly setTotalCount = this.updater((state, totalCount: number) => ({ ...state, totalCount }));

  readonly setSearchQuery = this.updater((state, searchQuery: string) => ({
    ...state,
    searchQuery,
    currentPage: 1,
  }));

  readonly setSortBy = this.updater((state, sortBy: 'createdAt' | 'priority' | 'title') => ({
    ...state,
    sortBy,
    currentPage: 1,
  }));

  readonly toggleSortOrder = this.updater((state) => ({
    ...state,
    sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
  }));

  readonly nextPage = this.updater((state) => ({
    ...state,
    currentPage: state.currentPage + 1,
  }));

  readonly prevPage = this.updater((state) => ({
    ...state,
    currentPage: Math.max(1, state.currentPage - 1),
  }));

  readonly resetPagination = this.updater(() => ({
    ...initialState,
  }));

  getPaginationTodos(todos: Todo[]): Observable<{
    items: Todo[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    return this.paginationInfo$.pipe(
      map(({ currentPage, pageSize, startIndex, endIndex }) => {
        const totalItems = todos.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return {
          items: todos.slice(startIndex, endIndex),
          totalItems,
          totalPages,
          currentPage,
          pageSize,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        };
      }),
    );
  }

  getCurrentPage(): number {
    return this.get((state) => state.currentPage);
  }

  getPageRange() {
    return this.get((state) => ({
      start: (state.currentPage - 1) * state.pageSize,
      end: state.currentPage * state.pageSize,
    }));
  }

  goToNextPageAndLoad() {
    const current = this.getCurrentPage();
    this.setPage(current + 1);
    console.log('Loading Page', current + 1);
  }

  readonly searchTodos = this.effect((searchText$: Observable<string>) =>
    searchText$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchText) => {
        if (!searchText.trim()) {
          this.setSearchQuery('');
          return EMPTY;
        }
        return this.todoService.searchTodos(searchText).pipe(
          tap(
            () => {
              this.setSearchQuery(searchText);
            },
            (error) => console.log('Search error:', error),
          ),
        );
      }),
    ),
  );

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    console.log('PaginationStore desstoryed - all subscriptions cleaned');
  }
}

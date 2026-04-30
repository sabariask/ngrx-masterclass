import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Todo } from '../../../models/todo.model';
import { debounceTime, distinctUntilChanged, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { TodoService } from '../../../services/todo.service';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  sortBy: 'createdAt' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: 5,
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'asc',
};

@Injectable()
export class TodoPaginationStore extends ComponentStore<PaginationState> {
  todoService = inject(TodoService);

  constructor() {
    super(initialState);
  }

  readonly currentPage$ = this.select((state) => state.currentPage);

  readonly pageSize$ = this.select((state) => state.pageSize);

  readonly searchQuery$ = this.select((state) => state.searchQuery);

  readonly sortBy$ = this.select((state) => state.sortBy);

  readonly sortOrder$ = this.select((state) => state.sortOrder);

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
    this.searchQuery$,
    this.sortBy$,
    this.sortOrder$,
    (currentPage, pageSize, searchQuery, sortBy, sortOrder) => ({
      currentPage,
      pageSize,
      searchQuery,
      sortBy,
      sortOrder,
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
}

import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { debounceTime, distinctUntilChanged, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { TodoService } from '../../../services/todo.service';
import { tapResponse } from '@ngrx/operators';

export interface FilterState {
  searchText: string;
  priority: 'all' | 'low' | 'medium' | 'high';
  status: 'all' | 'pending' | 'completed';
  dueDateFrom: string | null;
  dueDateTo: string | null;
  showFilters: boolean;
  suggestions: string[];
  suggestionLoading: boolean;
}

const initialFilterState: FilterState = {
  searchText: '',
  priority: 'all',
  status: 'all',
  dueDateFrom: null,
  dueDateTo: null,
  showFilters: false,
  suggestions: [],
  suggestionLoading: false,
};

@Injectable()
export class TodoFilterStore extends ComponentStore<FilterState> {
  todoService = inject(TodoService);

  constructor() {
    super(initialFilterState);
  }

  readonly searchText$ = this.select((s) => s.searchText);
  readonly priority$ = this.select((s) => s.priority);
  readonly status$ = this.select((s) => s.status);
  readonly showFilters$ = this.select((s) => s.showFilters);
  readonly suggestion$ = this.select((s) => s.suggestions);
  readonly suggestLoading$ = this.select((s) => s.suggestionLoading);

  readonly activeFilterCount$ = this.select(
    this.priority$,
    this.status$,
    this.searchText$,
    (priority, status, searchtext) => {
      let count = 0;
      if (priority !== 'all') count++;
      if (status !== 'all') count++;
      if (searchtext !== '') count++;

      return count;
    },
  );

  readonly hasActiveFilters$ = this.select(this.activeFilterCount$, (count) => count > 0);

  readonly filterState$ = this.select(
    this.searchText$,
    this.priority$,
    this.status$,
    (searchText, priority, status) => ({
      searchText,
      priority,
      status,
    }),
  );

  readonly setSearchText = this.updater((state, searchText: string) => ({
    ...state,
    searchText,
  }));

  readonly setPriority = this.updater((state, priority: FilterState['priority']) => ({
    ...state,
    priority,
  }));

  readonly setStatus = this.updater((state, status: FilterState['status']) => ({
    ...state,
    status,
  }));

  readonly toggleFiltersPanel = this.updater((state) => ({
    ...state,
    showFilters: !state.showFilters,
  }));

  // readonly setSuggestions = this.updater((state, suggestions: string[]) => ({
  //   ...state,
  //   suggestions,
  //   suggestionLoading: false,
  // }));

  // readonly clearSuggestions = this.updater((state) => ({
  //   ...state,
  //   suggestions: [],
  //   suggestionLoading: false,
  // }));

  readonly clearAllFilters = this.updater((state) => ({
    ...initialFilterState,
  }));

  readonly searchEffect = this.effect((searchText$: Observable<string>) =>
    searchText$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.patchState({ suggestionLoading: true })),
      switchMap((text) => {
        if (!text.trim()) {
          this.patchState({ suggestionLoading: true });
          return EMPTY;
        }

        return this.todoService.searchTodos(text).pipe(
          tapResponse(
            (todos) => {
              const suggestions = todos.map((t) => t.title);
              this.patchState({ suggestions: todos.map((t) => t.title), suggestionLoading: false });
            },
            (error) => {
              console.error('Search error:', error);
              this.patchState({ suggestionLoading: false, suggestions: [] });
            },
          ),
        );
      }),
    ),
  );

  readonly initFilters = this.effect<void>((trigger$: Observable<void>) =>
    trigger$.pipe(
      switchMap(() =>
        this.todoService.getAllTodos().pipe(
          tapResponse(
            (todos) => {
              const priorities = [...new Set(todos.map((t) => t.priority))];
              console.log('Available priorities:', priorities);
            },
            (error) => console.error('Init Error:', error),
          ),
        ),
      ),
    ),
  );
}

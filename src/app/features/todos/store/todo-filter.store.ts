import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface FilterState {
  searchText: string;
  priority: 'all' | 'low' | 'medium' | 'high';
  status: 'all' | 'pending' | 'completed';
  dueDateFrom: string | null;
  dueDateTo: string | null;
  showFilters: boolean;
}

const initialFilterState: FilterState = {
  searchText: '',
  priority: 'all',
  status: 'all',
  dueDateFrom: null,
  dueDateTo: null,
  showFilters: false,
};

@Injectable()
export class TodoFilterStore extends ComponentStore<FilterState> {
  constructor() {
    super(initialFilterState);
  }

  readonly searchText$ = this.select((s) => s.searchText);
  readonly priority$ = this.select((s) => s.priority);
  readonly status$ = this.select((s) => s.status);
  readonly showFilters$ = this.select((s) => s.showFilters);

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

  readonly clearAllFilters = this.updater((state) => ({
    ...initialFilterState,
  }));
}

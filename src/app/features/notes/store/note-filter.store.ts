import { Injectable } from '@angular/core';
import { Note } from './note.model';
import { ComponentStore } from '@ngrx/component-store';

export interface NoteFilterState {
  searchText: string;
  activeFilter: 'all' | 'pinned' | Note['category'];
}

const initialState: NoteFilterState = {
  searchText: '',
  activeFilter: 'all',
};

@Injectable()
export class NoteFilterStore extends ComponentStore<NoteFilterState> {
  constructor() {
    super(initialState);
  }

  readonly searchText$ = this.select((s) => s.searchText);
  readonly activeFilter$ = this.select((s) => s.activeFilter);

  readonly filterState$ = this.select(
    this.searchText$,
    this.activeFilter$,
    (searchText, activeFilter) => ({
      searchText,
      activeFilter,
    }),
  );

  readonly activeFilterCount$ = this.select(
    this.searchText$,
    this.activeFilter$,
    (text, activeFilter) => {
      let count = 0;
      if (text) count++;
      if (activeFilter !== 'all') count++;
      return count;
    },
  );

  readonly setSearchText = this.updater((state, searchText: string) => ({ ...state, searchText }));
  readonly setActiveFilter = this.updater(
    (state, activeFilter: NoteFilterState['activeFilter']) => ({
      ...state,
      activeFilter: state.activeFilter === activeFilter ? 'all' : activeFilter,
    }),
  );

  readonly clearFilters = this.updater(() => ({ ...initialState }));
}

import { Injectable } from '@angular/core';
import { Note } from './note.model';
import { ComponentStore } from '@ngrx/component-store';

export interface NoteFilterState {
  searchText: string;
  category: 'all' | Note['category'];
  showPinned: boolean;
}

const initialState: NoteFilterState = {
  searchText: '',
  category: 'all',
  showPinned: false,
};

@Injectable()
export class NoteFilterStore extends ComponentStore<NoteFilterState> {
  constructor() {
    super(initialState);
  }

  readonly searchText$ = this.select((s) => s.searchText);
  readonly category$ = this.select((s) => s.category);
  readonly showPinned$ = this.select((s) => s.showPinned);

  readonly filterState$ = this.select(
    this.searchText$,
    this.category$,
    this.showPinned$,
    (searchText, category, showPinned) => ({
      searchText,
      category,
      showPinned,
    }),
  );

  readonly activeFilterCount$ = this.select(
    this.searchText$,
    this.category$,
    this.showPinned$,
    (text, cat, pinned) => {
      let count = 0;
      if (text) count++;
      if (cat !== 'all') count++;
      if (pinned) count++;
      return count;
    },
  );

  readonly setSearchText = this.updater((state, searchText: string) => ({ ...state, searchText }));
  readonly setCategory = this.updater((state, category: NoteFilterState['category']) => ({
    ...state,
    category,
  }));
  readonly toggleShowPinned = this.updater((state) => ({
    ...state,
    showPinned: !state.showPinned,
  }));

  readonly clearFilters = this.updater(() => ({ ...initialState }));
}

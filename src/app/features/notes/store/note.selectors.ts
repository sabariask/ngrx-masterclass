import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, NoteState } from './note.state';
import { Note } from './note.model';

export const selectNoteState = createFeatureSelector<NoteState>('notes');

export const selectAllNotes = createSelector(selectNoteState, (state) => {
  if (!state) return [];
  return adapter.getSelectors().selectAll(state);
});

export const selectNoteEntites = createSelector(selectNoteState, (state) => {
  if (!state) return {};
  return adapter.getSelectors().selectEntities(state);
});

export const selectNotesLoading = createSelector(
  selectNoteState,
  (state) => state?.loading ?? false,
);

export const selectNotesError = createSelector(selectNoteState, (state) => state?.error ?? null);

export const selectPinnedNotes = createSelector(selectAllNotes, (notes) =>
  notes.filter((n) => n.isPinned),
);

export const selectUnpinnedNoted = createSelector(selectAllNotes, (notes) =>
  notes.filter((n) => !n.isPinned),
);

export const selectNotesByCategory = (category: Note['category']) =>
  createSelector(selectAllNotes, (notes) => notes.filter((n) => n.category === category));

export const selectNotesCount = createSelector(selectAllNotes, (notes) => ({
  total: notes.length,
  pinned: notes.filter((n) => n.isPinned).length,
  personal: notes.filter((n) => n.category === 'personal').length,
  work: notes.filter((n) => n.category === 'work').length,
  learning: notes.filter((n) => n.category === 'learning').length,
  other: notes.filter((n) => n.category === 'other').length,
}));

export const selectNoteById = (id: number) =>
  createSelector(selectNoteEntites, (entities) => entities[id] ?? null);

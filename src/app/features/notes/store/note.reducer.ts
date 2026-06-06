import { createReducer, on } from '@ngrx/store';
import { adapter, initialNoteState } from './note.state';
import { NoteActions } from './note.actions';

export const noteReducer = createReducer(
  initialNoteState,

  // Load
  on(NoteActions.loadNotes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(NoteActions.loadNotesSuccess, (state, { notes }) =>
    adapter.setAll(notes, { ...state, loading: false, error: null }),
  ),
  on(NoteActions.loadNotesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add
  on(NoteActions.addNote, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(NoteActions.addNoteSuccess, (state, { note }) =>
    adapter.addOne(note, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(NoteActions.addNoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete
  on(NoteActions.deleteNote, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(NoteActions.deleteNoteSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(NoteActions.deleteNoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),

  // Update,
  on(NoteActions.updateNote, (state, { id, title, content }) =>
    adapter.updateOne({ id, changes: { title, content } }, { ...state, error: null }),
  ),
  on(NoteActions.updateNoteSuccess, (state, { note }) =>
    adapter.updateOne({ id: note.id, changes: note }, { ...state }),
  ),
  on(NoteActions.updateNoteFailure, (state, { id, previousTitle, previousContent, error }) =>
    adapter.updateOne(
      { id, changes: { title: previousTitle, content: previousContent } },
      { ...state, error },
    ),
  ),

  // Pin Optimistics
  on(NoteActions.pinNote, (state, { id, previousIsPinned }) =>
    adapter.updateOne({ id, changes: { isPinned: !previousIsPinned } }, { ...state, error: null }),
  ),
  on(NoteActions.pinNoteSuccess, (state, { id, isPinned }) =>
    adapter.updateOne({ id, changes: { isPinned } }, { ...state }),
  ),
  on(NoteActions.pinNoteFailure, (state, { id, previousIsPinned, error }) =>
    adapter.updateOne({ id, changes: { isPinned: previousIsPinned } }, { ...state, error }),
  ),

  // Select Note
  on(NoteActions.selectNote, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
);

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Note } from './note.model';

export interface NoteState extends EntityState<Note> {
  loading: boolean;
  error: string | null;
  selectedId: number | null;
}

export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>({
  selectId: (note) => note.id,
  sortComparer: (a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.createdAt > b.createdAt ? -1 : 1;
  },
});

export const initialNoteState: NoteState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedId: null,
});



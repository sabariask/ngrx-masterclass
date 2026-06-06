import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateNoteDTO, Note } from './note.model';

export const NoteActions = createActionGroup({
  source: 'Notes',
  events: {
    // load
    'Load Notes': emptyProps(),
    'Load Notes Success': props<{ notes: Note[] }>(),
    'Load Notes Failure': props<{ error: string }>(),

    // Add
    'Add Note': props<{ dto: CreateNoteDTO }>(),
    'Add Note Success': props<{ note: Note }>(),
    'Add Note Failure': props<{ error: string }>(),

    // Delete Note
    'Delete Note': props<{ id: number }>(),
    'Delete Note Success': props<{ id: number }>(),
    'Delete Note Failure': props<{ error: string }>(),

    // Update Content
    'Update Note': props<{ id: number; title: string; content: string }>(),
    'Update Note Success': props<{ note: Note }>(),
    'Update Note Failure': props<{
      id: number;
      previousTitle: string;
      previousContent: string;
      error: string;
    }>(),

    // Pin Optimistic
    'Pin Note': props<{ id: number; previousIsPinned: boolean }>(),
    'Pin Note Success': props<{ id: number; isPinned: boolean }>(),
    'Pin Note Failure': props<{ id: number; previousIsPinned: boolean; error: string }>(),

    // Select Note
    'Select Note': props<{ id: number }>(),
  },
});

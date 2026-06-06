import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { noteReducer } from './store/note.reducer';
import { provideEffects } from '@ngrx/effects';
import { NoteEffects } from './store/note.effects';

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState('notes', noteReducer), provideEffects([NoteEffects])],
    loadComponent: () => import('../notes/note-list/note-list').then((m) => m.NoteList),
  },
];

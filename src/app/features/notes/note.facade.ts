import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as NoteSelectors from '../notes/store/note.selectors';
import { NoteActions } from './store/note.actions';
import { CreateNoteDTO } from './store/note.model';

@Injectable()
export class NoteFacade {
  private store = inject(Store);

  allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
  loading$ = this.store.select(NoteSelectors.selectNotesLoading);
  error$ = this.store.select(NoteSelectors.selectNotesError);
  counts$ = this.store.select(NoteSelectors.selectNotesCount);
  pinnedNotes$ = this.store.select(NoteSelectors.selectPinnedNotes);

  getNoteById$(id: number) {
    return this.store.select(NoteSelectors.selectNoteById(id));
  }

  loadNotes(): void {
    this.store.dispatch(NoteActions.loadNotes());
  }

  addNotes(dto: CreateNoteDTO): void {
    this.store.dispatch(NoteActions.addNote({ dto }));
  }

  deleteNote(id: number): void {
    this.store.dispatch(NoteActions.deleteNote({ id }));
  }

  updateNote(id: number, title: string, content: string) {
    this.store.dispatch(NoteActions.updateNote({ id, title, content }));
  }

  pinNote(id: number, isPinned: boolean) {
    this.store.dispatch(NoteActions.pinNote({ id, previousIsPinned: isPinned }));
  }
}

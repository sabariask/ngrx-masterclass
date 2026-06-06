import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NoteService } from '../../../services/note';
import { ToastService } from '../../../services/toast.service';
import { NoteActions } from './note.actions';
import { catchError, map, mergeMap, of, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import * as NoteSelectors from '../store/note.selectors';

@Injectable()
export class NoteEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private noteService = inject(NoteService);
  private toastService = inject(ToastService);

  loadEffects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteActions.loadNotes),
      switchMap(() =>
        this.noteService.getAllNotes().pipe(
          map((notes) => NoteActions.loadNotesSuccess({ notes })),
          catchError((error) =>
            of(NoteActions.loadNotesFailure({ error: this.getErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  addNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteActions.addNote),
      switchMap(({ dto }) =>
        this.noteService.addNote(dto).pipe(
          map((note) => NoteActions.addNoteSuccess({ note })),
          catchError((error) =>
            of(NoteActions.addNoteFailure({ error: this.getErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  addSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NoteActions.addNoteSuccess),
        tap(() => this.toastService.success('Note added! 📝')),
      ),
    {
      dispatch: false,
    },
  );

  deleteNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteActions.deleteNote),
      mergeMap(({ id }) =>
        this.noteService.deleteNote(id).pipe(
          map(() => NoteActions.deleteNoteSuccess({ id })),
          catchError((error) =>
            of(NoteActions.deleteNoteFailure({ error: this.getErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  deleteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NoteActions.deleteNoteSuccess),
        tap(({ id }) => this.toastService.success(`Note ${id} deleted!`)),
      ),
    {
      dispatch: false,
    },
  );

  updateNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteActions.updateNote),
      withLatestFrom(this.store.select(NoteSelectors.selectNoteEntites)),
      mergeMap(([{ id, title, content }, entities]) => {
        const previousTitle = entities[id]?.title ?? '';
        const previousContent = entities[id]?.content ?? '';

        return this.noteService.updateNote(id, title, content).pipe(
          map((note) => NoteActions.updateNoteSuccess({ note })),
          catchError((error) =>
            of(
              NoteActions.updateNoteFailure({
                id,
                previousTitle,
                previousContent,
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        );
      }),
    ),
  );

  updateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NoteActions.updateNoteSuccess),
        tap(() => this.toastService.success('Note updated! ✅')),
      ),
    {
      dispatch: false,
    },
  );

  updateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NoteActions.updateNoteFailure),
        tap(({ error }) => this.toastService.error(`Update failed: ${error}. Reverted. ↩️`)),
      ),
    {
      dispatch: false,
    },
  );

  pinNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteActions.pinNote),
      mergeMap(({ id, previousIsPinned }) =>
        this.noteService.pinNote(id, !previousIsPinned).pipe(
          map((note) => NoteActions.pinNoteSuccess({ id, isPinned: note.isPinned })),
          catchError((error) =>
            of(
              NoteActions.pinNoteFailure({
                id,
                previousIsPinned,
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  pinFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NoteActions.pinNoteFailure),
        tap(({ error }) => this.toastService.error(`Pin failed: ${error}. Reverted. ↩️`)),
      ),
    {
      dispatch: false,
    },
  );

  private getErrorMessage(error: any): string {
    if (error.name === 'TimeoutError') {
      return 'Request time out.';
    }

    switch (error.status) {
      case 0:
        return 'No internet connection.';
      case 401:
        return 'Unauthorized';
      case 404:
        return 'Not found.';
      case 500:
        return 'Server error.';
      default:
        return error.message ?? 'Unexpected error.';
    }
  }
}

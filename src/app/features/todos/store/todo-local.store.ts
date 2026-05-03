import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TodoService } from '../../../services/todo.service';
import { Store } from '@ngrx/store';
import { EMPTY, switchMap, withLatestFrom } from 'rxjs';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { tapResponse } from '@ngrx/operators';
import { TodoActions } from './todo.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface LocalTodoState {
  editingId: number | null;
  editTitle: string;
  isSaving: boolean;
  saveError: string | null;
}

@Injectable()
export class LocalTodoStore extends ComponentStore<LocalTodoState> {
  todoService = inject(TodoService);
  globalStore = inject(Store);

  constructor() {
    super({
      editingId: null,
      editTitle: '',
      isSaving: false,
      saveError: null,
    });
  }

  readonly editingId$ = this.select((s) => s.editingId);
  readonly editTitle$ = this.select((s) => s.editTitle);
  readonly isSaving$ = this.select((s) => s.isSaving);
  readonly isEditing$ = this.select((s) => s.editingId !== null);

  readonly startEditing = this.updater((state, id: number) => ({
    ...state,
    editingId: id,
    editTitle: '',
    saveError: null,
  }));

  readonly setEditTitle = this.updater((state, editTitle: string) => ({ ...state, editTitle }));

  readonly cancelEditing = this.updater((state) => ({
    ...state,
    editingId: null,
    editTitle: '',
    saveError: null,
  }));

  readonly saveEdit = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(
        this.select((s) => s),
        this.globalStore.select(selectAuthUser),
      ),
      switchMap(([, localState, user]) => {
        if (!localState.editingId || !localState.editTitle.trim()) {
          return EMPTY;
        }

        this.patchState({ isSaving: true, saveError: null });

        return this.todoService.updateTodoTitle(localState.editingId, localState.editTitle).pipe(
          tapResponse(
            (updatedTodo) => {
              this.globalStore.dispatch(TodoActions.updateTodoTitileSuccess({ todo: updatedTodo }));
              this.patchState({
                editingId: null,
                editTitle: '',
                isSaving: false,
              });
            },
            (error: HttpErrorResponse) => {
              this.patchState({
                isSaving: false,
                saveError: 'message' in error ? error?.message : 'Save failed',
              });
            },
          ),
        );
      }),
    ),
  );
}

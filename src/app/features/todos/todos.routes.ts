import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { todoReducer } from './store/todo.reducer';
import { provideEffects } from '@ngrx/effects';
import { TodoEffects } from './store/todo.effects';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState('todos', todoReducer), provideEffects([TodoEffects])],
    loadComponent: () => import('./todo-list/todo-list').then((m) => m.TodoList),
  },
];

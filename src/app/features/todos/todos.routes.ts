import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { todoReducer } from './store/todo.reducer';
import { provideEffects } from '@ngrx/effects';
import { TodoEffects } from './store/todo.effects';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState('todos', todoReducer), provideEffects([TodoEffects])],
    children: [
      {
        path: '',
        loadComponent: () => import('./todo-list/todo-list').then((m) => m.TodoList),
      },
      {
        path: ':id',
        loadComponent: () => import('./todo-detail/todo-detail').then((m) => m.TodoDetail),
      },
    ],
  },
];

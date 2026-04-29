import { Routes } from '@angular/router';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
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

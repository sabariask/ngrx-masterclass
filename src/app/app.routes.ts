import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Counter } from '../app/features/counter/counter';
import { authGuard } from './guards/auth-guard';
import { redirectIfLoggedInGuard } from './guards/redirect-if-logged-in-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [redirectIfLoggedInGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    loadChildren: () => import('../app/features/todos/todos.routes').then((m) => m.TODOS_ROUTES),
  },
  {
    path: 'counter',
    loadChildren: () =>
      import('../app/features/counter/counter.routes').then((m) => m.COUNTER_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

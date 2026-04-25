import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { counterReducer } from './store/counter.reducer';

export const COUNTER_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState('counter', counterReducer)],
    loadComponent: () => import('./counter').then((m) => m.Counter),
  },
];

import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { counterReducer } from './state/counter/counter.reducer';
import { todoReducer } from './state/todos/todo.reducer';
import { authReducer } from './state/auth/auth.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { TodoEffects } from './state/todos/todo.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      counter: counterReducer,
      todos: todoReducer,
      auth: authReducer
    }),
    provideEffects([
      AuthEffects,
      TodoEffects
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), autoPause: true, trace: false }),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};

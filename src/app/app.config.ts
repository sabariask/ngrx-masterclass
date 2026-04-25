import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { counterReducer } from '../app/features/counter/store/counter.reducer';
import { todoReducer } from '../app/features/todos/store/todo.reducer';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { TodoEffects } from '../app/features/todos/store/todo.effects';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStore({
      auth: authReducer,
    }),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideEffects([AuthEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), autoPause: true, trace: false }),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};

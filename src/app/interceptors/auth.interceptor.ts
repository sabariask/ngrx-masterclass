import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { JwtService } from '../services/jwt';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const store = inject(Store);
  const jwtService = inject(JwtService);

  let token: string | null = localStorage.getItem('auth_token');

  const addToken = (request: HttpRequest<any>, authToken: string) =>
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

  if (req.url.includes('/users?email=')) {
    return next(req);
  }

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('auth_refresh_token');

        if (refreshToken) {
          store.dispatch(AuthActions.refreshToken());

          return store.select(AuthSelectors.selectAuthToken).pipe(
            filter((t) => t !== token),
            take(1),
            switchMap((newToken) => {
              if (!newToken) {
                return throwError(() => error);
              }

              const retryReq = addToken(req, newToken);
              return next(retryReq);
            }),
          );
        }
        store.dispatch(AuthActions.logout());
      }
      return throwError(() => error);
    }),
  );
};

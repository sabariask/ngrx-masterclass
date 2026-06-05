import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, switchMap, tap, timer, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { JwtService } from '../../services/jwt';
import * as AuthSelectors from '../auth/auth.selectors';
@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  userService = inject(UserService);
  router = inject(Router);
  store = inject(Store);
  jwtService = inject(JwtService);

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        const refreshToken = localStorage.getItem('auth_refresh_token');

        if (!token || !userStr) {
          return AuthActions.logoutSuccess();
        }

        try {
          const user = JSON.parse(userStr);

          if (this.jwtService.isTokenExpired(token)) {
            if (refreshToken) {
              console.log('Access token expired, attempting refresh...');
              return AuthActions.refreshToken();
            }
            return AuthActions.logoutSuccess();
          }

          const tokenExpiry = this.jwtService.getTokenExpiry(token) ?? 0;

          return AuthActions.loginSuccess({
            user,
            token,
            refreshToken: refreshToken ?? '',
            tokenExpiry,
          });
        } catch {
          return AuthActions.logoutSuccess();
        }
      }),
    ),
  );

  saveToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token, refreshToken }) => {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          localStorage.setItem('auth_refresh_token', refreshToken);
        }),
      ),
    {
      dispatch: false,
    },
  );

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      switchMap(() =>
        this.userService.getMockUser().pipe(
          map((user) => AuthActions.loadProfileSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.loadProfileFailure({
                error: error.message ?? 'Failed to load profile',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.userService.login(email, password).pipe(
          map(({ user, token, refreshToken, tokenExpiry }) =>
            AuthActions.loginSuccess({ user, token, refreshToken, tokenExpiry }),
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message ?? 'Failed to login' })),
          ),
        ),
      ),
    ),
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          const currentUrl = this.router.url;

          if (currentUrl === '/login' || currentUrl === '/') {
            this.router.navigate(['/dashboard']);
          }
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => AuthActions.logoutSuccess()),
    ),
  );

  clearToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('ngrx_state');
        }),
      ),
    {
      dispatch: false,
    },
  );

  logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );

  scheduleTokenRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.refreshTokenSuccess),
      withLatestFrom(this.store.select(AuthSelectors.selectAuthToken)),
      switchMap(([, token]) => {
        if (!token) return of(AuthActions.logoutSuccess());

        const expiry = this.jwtService.getTokenExpiry(token);
        if (!expiry) return of(AuthActions.logoutSuccess());

        const nowInSeconds = Math.floor(Date.now() / 1000);
        const secondsLeft = expiry - nowInSeconds;
        const refreshIn = Math.max(0, (secondsLeft - 60) * 1000);
        console.log(`Token refreshes in ${Math.floor(refreshIn / 1000)} seconds`);

        return timer(refreshIn).pipe(map(() => AuthActions.refreshToken()));
      }),
    ),
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      withLatestFrom(this.store.select(AuthSelectors.selectRefreshToken)),
      switchMap(([, refreshToken]) => {
        if (!refreshToken) return of(AuthActions.refreshTokenFailure());

        return this.userService.refreshToken(refreshToken).pipe(
          map(({ token, tokenExpiry }) => {
            localStorage.setItem('auth_token', token);
            return AuthActions.refreshTokenSuccess({
              token,
              tokenExpiry,
            });
          }),
          catchError(() => {
            console.error('Token refreshed failed - logging out');
            return of(AuthActions.refreshTokenFailure());
          }),
        );
      }),
    ),
  );

  refreshFailureLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenFailure),
      map(() => AuthActions.logoutSuccess()),
    ),
  );
}

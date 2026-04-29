import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  userService = inject(UserService);
  router = inject(Router);

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('auth_user');

        console.log('Init token found!!', token);

        if (token && user) {
          try {
            const authUser = JSON.parse(user);

            return AuthActions.loginSuccess({ user: authUser, token });
          } catch {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
        return AuthActions.logoutSuccess();
      }),
    ),
  );

  saveToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token }) => {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_user", JSON.stringify(user));
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
      exhaustMap(() =>
        this.userService.getMockUser().pipe(
          map((user) => AuthActions.loginSuccess({ user, token: 'mock-jwt-' + Date.now() })),
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

  clearToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }),
    ),
    {
      dispatch: false
    }
  );

  logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}

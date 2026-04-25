import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthActions } from './auth.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  userService = inject(UserService);
  router = inject(Router);

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
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => AuthActions.logoutSuccess()),
    ),
  );

  logoutRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => this.router.navigate(['/login'])),
    ),
    { dispatch: false }
  );
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthLoading, selectIsLoggedIn } from '../store/auth/auth.selectors';
import { combineLatest, map, skipWhile, take } from 'rxjs';

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([store.select(selectIsLoggedIn), store.select(selectAuthLoading)]).pipe(
    skipWhile(([, loading]) => loading === true),
    take(1),
    map(([isLoggedIn]) => {
      console.log('RedirectIfLoggedIn - isLoggedIn', isLoggedIn);
      if (!isLoggedIn) return true;
      return router.createUrlTree(['/dashboard']);
    }),
  );
};

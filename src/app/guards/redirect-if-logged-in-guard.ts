import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsLoggedIn,
} from '../store/auth/auth.selectors';
import { combineLatest, filter, map, skipWhile, take } from 'rxjs';

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([store.select(selectIsLoggedIn), store.select(selectAuthInitialized)]).pipe(
    filter(([, initialized]) => initialized === true),
    take(1),
    map(([isLoggedIn]) => {
      console.log('RedirectIfLoggedIn - isLoggedIn', isLoggedIn);
      if (!isLoggedIn) return true;
      return router.createUrlTree(['/dashboard']);
    }),
  );
};

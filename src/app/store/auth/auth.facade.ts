import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../auth/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthActions } from './auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  users$: Observable<User | null> = this.store.select(AuthSelectors.selectAuthUser);
  isLoggedIn$: Observable<boolean> = this.store.select(AuthSelectors.selectIsLoggedIn);
  loading$: Observable<boolean> = this.store.select(AuthSelectors.selectAuthLoading);
  error$: Observable<string | null> = this.store.select(AuthSelectors.selectAuthError);
  isAdmin$: Observable<boolean> = this.store.select(AuthSelectors.selectIsAdmin);
  userName$: Observable<string> = this.store.select(AuthSelectors.selectUserName);
  initialized$: Observable<boolean> = this.store.select(AuthSelectors.selectAuthInitialized);

  login(email: string, password: string) {
    this.store.dispatch(
      AuthActions.login({
        email,
        password,
      }),
    );
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  loadProfile() {
    this.store.dispatch(AuthActions.loadProfile());
  }
}

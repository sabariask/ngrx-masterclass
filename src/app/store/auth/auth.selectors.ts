import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(selectAuthState, (state) => state?.user ?? null);

export const selectAuthToken = createSelector(selectAuthState, (state) => state?.token ?? null);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state?.isLoggedIn ?? false,
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state?.loading ?? false,
);

export const selectAuthError = createSelector(selectAuthState, (state) => state?.error ?? null);

export const selectUserRole = createSelector(selectAuthUser, (user) => user?.role ?? 'guest');

export const selectUserName = createSelector(selectAuthUser, (user) => user?.name ?? 'Guest');

export const selectIsAdmin = createSelector(selectAuthUser, (user) => user?.role === 'admin');

export const selectAuthInitialized = createSelector(
  selectAuthState,
  (state) => state?.initialized ?? false,
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  s => s.refreshToken
);

export const selectTokenExpiry = createSelector(
  selectAuthState,
  s => s.tokenExpiry
);

export const selectIsRefreshing = createSelector(
  selectAuthState,
  s => s.isRefreshing
);
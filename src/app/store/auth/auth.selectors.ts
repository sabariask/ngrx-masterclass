import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(selectAuthState, (state) => state.user);

export const selectAuthToken = createSelector(selectAuthState, (state) => state.token);

export const selectIsLoggedIn = createSelector(selectAuthState, (state) => state.isLoggedIn);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectUserRole = createSelector(selectAuthUser, (user) => user?.role ?? 'guest');

export const selectUserName = createSelector(selectAuthUser, (user) => user?.name ?? 'Guest');

export const selectIsAdmin = createSelector(selectAuthUser, (user) => user?.role === 'admin');

export const selectAuthInitialized = createSelector(
  selectAuthState,
  (state) => state.initialized,
);

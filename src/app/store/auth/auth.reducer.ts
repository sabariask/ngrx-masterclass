import { createReducer, on } from '@ngrx/store';
import { clearAuthState, initialAuthState } from './auth.state';
import { AuthActions } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user, token, refreshToken, tokenExpiry }) => ({
    ...state,
    user,
    token,
    refreshToken,
    tokenExpiry,
    isLoggedIn: true,
    loading: false,
    error: null,
    initialized: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    initialized: true,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.logoutSuccess, () => ({
    ...clearAuthState,
  })),

  // Load profile
  on(AuthActions.loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
    initialized: true,
  })),
  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    initialized: true,
  })),
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isRefreshing: true
  })),
  on(AuthActions.refreshTokenSuccess, (state, { token, tokenExpiry })=>({
    ...state,
    token,
    tokenExpiry,
    isRefreshing: false
  })),
  on(AuthActions.refreshTokenFailure, (state) => ({
    ...clearAuthState
  }))
);

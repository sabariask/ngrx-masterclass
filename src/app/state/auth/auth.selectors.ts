import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";


export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
    selectAuthState,
    ({ user }) => user
);

export const selectAuthToken = createSelector(
    selectAuthState,
    ({ token }) => token
);

export const selectIsLoggedIn = createSelector(
    selectAuthState,
    ({ isLoggedIn }) => isLoggedIn
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    ({ loading }) => loading
);

export const selectAuthError = createSelector(
    selectAuthState,
    ({ error }) => error
);

export const selectUserRole = createSelector(
    selectAuthUser,
    (user) => user?.role ?? 'guest'
);

export const selectUserName = createSelector(
    selectAuthUser,
    (user) => user?.name ?? 'Guest'
);

export const selectIsAdmin = createSelector(
    selectAuthUser,
    (user) => user?.role === 'admin'
);


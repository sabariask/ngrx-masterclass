import { createReducer, on } from "@ngrx/store";
import { initialAuthState } from "./auth.state";
import { AuthActions } from "./auth.actions";



export const authReducer = createReducer(
    initialAuthState,

    // Login
    on(AuthActions.login, (state)=>({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.loginSuccess, (state, { user, token })=>({
        ...state,
        user,
        token,
        isLoggedIn: true,
        loading: false,
        error: null
    })),
    on(AuthActions.loginFailure, (state, { error })=>({
        ...state,
        user: null,
        token: null,
        isLoggedIn: false,
        loading: false,
        error
    })),

    // Logout
    on(AuthActions.logout, (state)=>({
        ...state,
        loading: true,
    })),
    on(AuthActions.logoutSuccess, ()=> ({
        ...initialAuthState
    })),

    // Load profile
    on(AuthActions.loadProfile, (state)=>({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.loadProfileSuccess, (state, { user })=>({
        ...state,
        user,
        loading: false,
        error: null
    })),
    on(AuthActions.loadProfileFailure, (state, { error })=>({
        ...state,
        loading: false,
        error
    }))
)
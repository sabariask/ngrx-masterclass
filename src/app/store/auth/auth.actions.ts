import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "../../models/user.model";


export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        // Login
        'Login': props<{ email: string; password: string }>(),
        'Login Success': props<{ user: User, token: string }>(),
        'Login Failure': props<{ error: string }>(),

        // logout
        'Logout': emptyProps(),
        'Logout Success': emptyProps(),

        // Load profiles
        'Load Profile': emptyProps(),
        'Load Profile Success': props<{ user: User }>(),
        'Load Profile Failure': props<{ error: string }>()
    }
})
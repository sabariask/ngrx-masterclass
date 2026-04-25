import { Todo } from "../models/todo.model";
import { User } from "../models/user.model";
import { AuthState } from "../store/auth/auth.state";
import { CounterState } from "../features/counter/store/counter.state";
import { TodoState } from "../features/todos/store/todo.state";

export interface AppState {
    todos?: TodoState;
    auth: AuthState;
    ui: {
        theme: 'light' | 'dark'
        sudebarOpen: boolean;
    }
    counter?: CounterState;
}
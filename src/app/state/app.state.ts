import { Todo } from "../models/todo.model";
import { User } from "../models/user.model";
import { AuthState } from "./auth/auth.state";
import { CounterState } from "./counter/counter.state";
import { TodoState } from "./todos/todo.state";

export interface AppState {
    todos: TodoState;
    auth: AuthState;
    ui: {
        theme: 'light' | 'dark'
        sudebarOpen: boolean;
    }
    counter: CounterState;
}
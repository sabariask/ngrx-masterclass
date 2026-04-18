import { Todo } from "../models/todo.model";
import { User } from "../models/user.model";
import { CounterState } from "./counter/counter.state";

export interface AppState {
    todos: {
        items: Todo[]
        loading: boolean;
        error: string | null;
    };
    auth: {
        user: User | null;
        isLoggedIn: boolean;
    };
    ui: {
        theme: 'light' | 'dark'
        sudebarOpen: boolean;
    }
    counter: CounterState;
}
import { Todo } from "../models/todo.model";
import { User } from "../models/user.model";

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
}
import { Todo } from "../../../models/todo.model";


export interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
    selectedId: number | null;
}

export const initialTodoState: TodoState = {
    todos: [],
    loading: false,
    error: null,
    selectedId: null
}
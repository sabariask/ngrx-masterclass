import { createReducer, on } from "@ngrx/store";
import { initialTodoState } from "./todo.state";
import { TodoActions } from "./todo.actions";


export const todoReducer = createReducer(
    initialTodoState,
    on(TodoActions.loadTodos, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
        ...state,
        todos,
        loading: false,
        error: null
    })),
    on(TodoActions.loadTodosFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Add Todo
    on(TodoActions.addTodo, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TodoActions.addTodoSuccess, (state, { todo }) => ({
        ...state,
        todos: [...state.todos, todo],
        loading: false,
        error: null
    })),
    on(TodoActions.addTodoFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    // Delete Todo
    on(TodoActions.deleteTodo, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TodoActions.deleteTodoSuccess, (state, { id }) => ({
        ...state,
        todos: state.todos.filter(todo => todo.id !== id),
        loading: false,
        error: null
    })),
    on(TodoActions.deleteTodoFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),


    // Toggle todo
    on(TodoActions.toggleTodo, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TodoActions.toggleTodoSuccess, (state, { id, completed }) => ({
        ...state,
        todos: state.todos.map(todo =>
            todo.id === id
                ? { ...todo, completed }
                : todo
        ),
        error: null,
        loading: false
    })),
    on(TodoActions.toggleTodoFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    //Clear All
    on(TodoActions.clearAllTodos, (state) => ({
        ...state,
        todos: [],
        error: null
    }))
)
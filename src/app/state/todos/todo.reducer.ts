import { createReducer, on } from "@ngrx/store";
import { initialTodoState } from "./todo.state";
import { TodoActions } from "./todo.actions";
import { Todo } from "../../models/todo.model";


const mockTodos: Todo[] = [
    { id: 1, title: 'Learn NgRx Actions', completed: false, priority: 'low', userId: 1, createdAt: '2024-01-15', description: 'Study createAction' },
    { id: 2, title: 'Build Counter App', completed: true, priority: 'medium', userId: 1, createdAt: '2024-01-14', description: 'BehaviorSubject practice' },
    { id: 3, title: 'Master RxJS Operators', completed: false, priority: 'high', userId: 1, createdAt: '2024-01-13', description: 'switchMap, catchError' },
];

export const todoReducer = createReducer(
    initialTodoState,
    on(TodoActions.loadTodos, (state) => ({
        ...state,
        loading: false,
        todos: mockTodos,
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
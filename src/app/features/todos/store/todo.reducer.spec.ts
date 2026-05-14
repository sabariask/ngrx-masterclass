import { Todo } from '../../../models/todo.model';
import { TodoActions } from './todo.actions';
import { todoReducer } from './todo.reducer';
import { adapter, initialTodoState } from './todo.state';

const mockTodo1: Todo = {
  id: 1,
  title: 'Learn Ngrx',
  description: 'Study Ngrx patterns',
  priority: 'high',
  userId: 1,
  createdAt: '2024-01-15',
  dueDate: '2024-01-20',
  completed: false,
};

const mockTodo2: Todo = {
  id: 2,
  title: 'Build App',
  description: 'Build todo app',
  priority: 'medium',
  userId: 1,
  createdAt: '2024-01-14',
  dueDate: null,
  completed: true,
};

const mockTodo3: Todo = {
  id: 3,
  title: 'Master RxJS',
  description: 'Learn RxJs operators',
  priority: 'high',
  userId: 1,
  createdAt: '2024-01-13',
  dueDate: null,
  completed: false,
};

const stateWithTodos = adapter.setAll([mockTodo1, mockTodo2, mockTodo3], initialTodoState);

describe('todoReducer', () => {
  describe('Initial State', () => {
    it('Should return initial State when unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const state = todoReducer(undefined, action);

      expect(state).toEqual(initialTodoState);
      expect(state.loading).toBeFalsy();
      expect(state.error).toBeNull();
    });

    it('Should have empty ids and entities initially', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const state = todoReducer(undefined, action);
      expect(state.ids.length).toEqual(0);
      expect(Object.keys(state.entities).length).toEqual(0);
    });
  });

  describe('loadTodos', () => {
    it('Should set loading to true', () => {
      const action = TodoActions.loadTodos();
      const state = todoReducer(initialTodoState, action);
      expect(state.loading).toBeTruthy();
    });

    it('Should clear error when loading starts', () => {
      const stateWithErros = {
        ...initialTodoState,
        error: 'Previous Error',
      };

      const action = TodoActions.loadTodos();
      const state = todoReducer(stateWithErros, action);

      expect(state.error).toBeNull();
    });
  });

  describe('loadTodoSuccess', () => {
    it('shouls store todos in state', () => {
      const todos = [mockTodo1, mockTodo2, mockTodo3];
      const action = TodoActions.loadTodosSuccess({ todos });

      const state = todoReducer(initialTodoState, action);

      const result = adapter.getSelectors().selectAll(state);
      expect(result.length).toEqual(3);
      expect(result[0].id).toEqual(1);
    });

    it('Should Replace existing todos not append', () => {
      const newTodos = [mockTodo1];
      const action = TodoActions.loadTodosSuccess({ todos: newTodos });
      const state = todoReducer(stateWithTodos, action);
      const result = adapter.getSelectors().selectAll(state);
      expect(result.length).toEqual(1);
    });
  });

  describe('loadTodosFailure', () => {
    it('Should store error message', () => {
      const action = TodoActions.loadTodosFailure({
        error: 'Network Error',
      });
      const state = todoReducer(initialTodoState, action);
      expect(state.error).toEqual('Network Error');
    });

    it('Should keep existing todos on failure', () => {
      const action = TodoActions.loadTodosFailure({
        error: 'Error',
      });
      const state = todoReducer(stateWithTodos, action);
      const result = adapter.getSelectors().selectAll(state);
      expect(result.length).toEqual(3);
    });
  });
});

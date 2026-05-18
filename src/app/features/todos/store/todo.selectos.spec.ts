import { Todo } from '../../../models/todo.model';
import { adapter, initialTodoState } from './todo.state';
import * as TodoSelectors from '../store/todo.selectors';

const mockTods: Todo[] = [
  {
    id: 1,
    title: 'Learn Ngrx',
    description: 'Study Ngrx patterns',
    priority: 'high',
    userId: 1,
    createdAt: '2024-01-15',
    dueDate: '2024-01-20',
    completed: false,
  },
  {
    id: 2,
    title: 'Build App',
    description: 'Build todo app',
    priority: 'medium',
    userId: 1,
    createdAt: '2024-01-14',
    dueDate: null,
    completed: true,
  },
  {
    id: 3,
    title: 'Master RxJS',
    description: 'Learn RxJs operators',
    priority: 'high',
    userId: 1,
    createdAt: '2024-01-13',
    dueDate: null,
    completed: false,
  },
  {
    id: 4,
    title: 'Write test',
    description: 'Write test case for selectors',
    priority: 'low',
    userId: 1,
    createdAt: '2024-01-13',
    dueDate: null,
    completed: false,
  },
];

const buildState = (todos: Todo[] = mockTods) => ({
  todos: adapter.setAll(todos, initialTodoState),
});

describe('Todo Selectors', () => {
  describe('selectAllTodso', () => {
    it('should return all todos as array', () => {
      const state = buildState();
      const result = TodoSelectors.selectAllTodos(state);
      expect(result.length).toEqual(4);
    });
    it('Should return empty array when state is undefined', () => {
      const state = { todos: undefined };
      const result = TodoSelectors.selectAllTodos(state);
      expect(result.length).toEqual(0);
    });
  });

  describe('selectCompletedTodos', () => {
    it('should return only completed todos', () => {
      const state = buildState();
      const result = TodoSelectors.selectCompletedTodos(state);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual(2);
    });

    it('Should return empty array when none completed', () => {
      const allPending = mockTods.map((t) => ({
        ...t,
        completed: false,
      }));
      const state = buildState(allPending);
      const result = TodoSelectors.selectCompletedTodos(state);
      expect(result.length).toEqual(0);
    });
  });

  describe('selectTodoById', () => {
    it('should return todo with matching id', () => {
      const state = buildState();
      const selector = TodoSelectors.selectTodoById(1);
      const result = selector(state);
      expect(result?.id).toEqual(1);
      expect(result?.title).toEqual('Learn Ngrx');
    });

    it('Should return bull for non-existent id', () => {
      const state = buildState();
      const selector = TodoSelectors.selectTodoById(999);
      const result = selector(state);
      expect(result).toBeNull();
    });
  });

  describe('memorization', () => {
    it('should return same reference when state unchanged', () => {
      const state = buildState();
      const result1 = TodoSelectors.selectAllTodos(state);
      const result2 = TodoSelectors.selectAllTodos(state);
      expect(result1).toEqual(result2);
    });

    it('should return new reference when state changes', () => {
      const state1 = buildState();
      const newTodo: Todo = {
        id: 99,
        title: 'New',
        completed: false,
        priority: 'low',
        userId: 1,
        createdAt: '2024-01-20',
        dueDate: null,
      };
      const state2 = {
        todos: adapter.addOne(newTodo, state1.todos),
      };
      const result1 = TodoSelectors.selectAllTodos(state1);
      const result2 = TodoSelectors.selectAllTodos(state2);

      expect(result1).not.toEqual(result2);
      expect(result2.length).toEqual(result1.length + 1);
    });
  });
});

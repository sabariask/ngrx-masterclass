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
});

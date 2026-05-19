import { defer, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { TodoEffects } from '../store/todo.effects';
import { TodoService } from '../../../services/todo.service';
import { ToastService } from '../../../services/toast.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { TodoActions } from './todo.actions';

const errorOf = <T>(message: string) =>
  defer(
    () =>
      new Observable<T>((observer) => {
        observer.error(new Error(message));
      }),
  );

const mockTodo1: Todo = {
  id: 1,
  title: 'Learn NgRx',
  completed: false,
  priority: 'high',
  userId: 1,
  createdAt: '2024-01-15',
  dueDate: null,
};

const mockTodo2: Todo = {
  id: 2,
  title: 'Build App',
  completed: true,
  priority: 'medium',
  userId: 1,
  createdAt: '2024-01-14',
  dueDate: null,
};

describe('TodoEffects', () => {
  let effects: TodoEffects;
  let actions$: ReplaySubject<any>;
  let todoService: jasmine.SpyObj<TodoService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let store: MockStore;

  beforeEach(() => {
    todoService = jasmine.createSpyObj('TodoService', [
      'getAllTodos',
      'getMockTodos',
      'addTodo',
      'deleteTodo',
      'toggleTodo',
      'updateTodoTitle',
    ]);

    toastService = jasmine.createSpyObj('ToastService', ['success', 'error']);
    actions$ = new ReplaySubject<any>();

    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            todos: {
              ids: [1, 2],
              entities: {
                1: mockTodo1,
                2: mockTodo2,
              },
              loading: false,
              error: null,
              filter: 'all',
              selectedId: null,
            },
          },
        }),
        { provide: TodoService, useValue: todoService },
        { provide: ToastService, useValue: toastService },
      ],
    });

    effects = TestBed.inject(TodoEffects);
    store = TestBed.inject(MockStore);
  });

  describe('loadTodos$', () => {
    it('should dispatch loadTodosSuccess on success', (done) => {
      const todos = [mockTodo1, mockTodo2];
      todoService.getAllTodos.and.returnValue(of(todos));

      actions$.next(TodoActions.loadTodos());
      effects.loadTodo$.subscribe((action) => {
        expect(action).toEqual(TodoActions.loadTodosSuccess({ todos }));
        done();
      });
    });

    it('should call todoService.getAllTodos', (done) => {
      todoService.getAllTodos.and.returnValue(of([]));
      actions$.next(TodoActions.loadTodos());
      effects.loadTodo$.subscribe(() => {
        expect(todoService.getAllTodos).toHaveBeenCalled();
        done();
      });
    });

    it('should keep effect alive after error', fakeAsync(() => {
      todoService.getAllTodos.and.returnValues(
        throwError(() => new Error('Error')),
        of([mockTodo1]),
      );

      const results: any[] = [];

      effects.loadTodo$.subscribe((action) => {
        results.push(action);
      });
      actions$.next(TodoActions.loadTodos());
      tick();
      expect(results.length).toBe(1);
      expect(results[0].type).toBe(TodoActions.loadTodosFailure.type);
      actions$.next(TodoActions.loadTodos());
      tick();
      expect(results.length).toBe(2);
      expect(results[1].type).toBe(TodoActions.loadTodosSuccess.type);
    }));
  });

  describe('addTodo$', () => {
    it('should dispatch addTodoSuccess on success', (done) => {
      const newTodo: Todo = {
        id: 99,
        title: 'New Todo',
        completed: false,
        priority: 'high',
        userId: 1,
        createdAt: '2024-01-20',
        dueDate: null,
      };
      todoService.addTodo.and.returnValue(of(newTodo));
      effects.addTodo$.subscribe((action) => {
        expect(action).toEqual(TodoActions.addTodoSuccess({ todo: newTodo }));
        done();
      });
      actions$.next(
        TodoActions.addTodo({
          title: 'New Todo',
          priority: 'high',
          description: '',
        }),
      );
    });

    it('should call service with correct data', (done) => {
      todoService.addTodo.and.returnValue(of(mockTodo1));
      effects.addTodo$.subscribe(() => {
        expect(todoService.addTodo).toHaveBeenCalledWith(
          jasmine.objectContaining({
            title: 'Test Todo',
            priority: 'medium',
            completed: false,
          }),
        );
        done();
      });
      actions$.next(
        TodoActions.addTodo({
          title: 'Test Todo',
          priority: 'medium',
          description: '',
        }),
      );
    });

    it('should dispatch addTodoFailure on error', fakeAsync(() => {
      todoService.addTodo.and.returnValue(
        new Observable((observer) => {
          observer.error({ message: 'Server error', status: 500 });
        }),
      );

      let result: any;
      let errorResult: any;

      effects.addTodo$.subscribe({
        next: (action) => {
          console.log('NEXT fired:', action);
          result = action;
        },
        error: (err) => {
          console.log('ERROR fired:', err);
          errorResult = err;
        },
      });

      actions$.next(
        TodoActions.addTodo({
          title: 'Test',
          priority: 'low',
          description: '',
        }),
      );

      tick();

      console.log('result:', result);
      console.log('errorResult:', errorResult);

      expect(result).toBeDefined();
      expect(result.type).toBe(TodoActions.addTodoFailure.type);
    }));
  });

  describe('updateTodoTitle$', () => {
    it('shoudl dispatch updateTodoTitleSuccess on success', (done) => {
      const updatedTodo: Todo = {
        ...mockTodo1,
        title: 'Updated Title',
      };
      todoService.updateTodoTitle.and.returnValue(of(updatedTodo));
      effects.updateTodoTitle$.subscribe((action) => {
        expect(action).toEqual(TodoActions.updateTodoTitileSuccess({ todo: updatedTodo }));
        done();
      });
      actions$.next(TodoActions.updateTodoTitle({ id: 1, title: 'Updated Title' }));
    });

    it('should dispatch failure with previousTitle', (done) => {
      todoService.updateTodoTitle.and.returnValue(
        new Observable((observer) => {
          observer.error({ message: 'Server error', status: 500 });
        }),
      );
      effects.updateTodoTitle$.subscribe((action) => {
        expect(action.type).toEqual(TodoActions.updateTodoTitileFailure.type);
        done();
      });

      actions$.next(
        TodoActions.updateTodoTitle({
          id: 1,
          title: 'New Title',
        }),
      );
    });
  });

  describe('deleteTodo$', () => {
    it('should dispatch deleteTodoSuccess on success', (done) => {
      todoService.deleteTodo.and.returnValue(of(1));
      effects.deleteTodo$.subscribe((action) => {
        expect(action).toEqual(TodoActions.deleteTodoSuccess({ id: 1 }));
        done();
      });

      actions$.next(TodoActions.deleteTodo({ id: 1 }));
    });

    it('should dispatch deleteTodoFailure on error', (done) => {
      todoService.deleteTodo.and.returnValue(errorOf('Delete failed'));

      effects.deleteTodo$.subscribe((action) => {
        expect(action.type).toBe(TodoActions.deleteTodoFailure.type);
        done();
      });

      actions$.next(TodoActions.deleteTodo({ id: 1 }));
    });
  });

  describe('toggleTodo$', () => {
    it('should dispatch toggleTodoSuccess on success', (done) => {
      const updatedTodo = { id: 1, completed: true };
      todoService.toggleTodo.and.returnValue(of(updatedTodo));

      effects.toggleTodo$.subscribe((action) => {
        expect(action).toEqual(
          TodoActions.toggleTodoSuccess({
            id: 1,
            completed: true,
          }),
        );
        done();
      });

      actions$.next(
        TodoActions.toggleTodo({
          id: 1,
          completed: false,
        }),
      );
    });

    it('should call service with flipped value', (done) => {
      todoService.toggleTodo.and.returnValue(of({ id: 1, completed: true }));

      effects.toggleTodo$.subscribe(() => {
        expect(todoService.toggleTodo).toHaveBeenCalledWith(1, true);
        done();
      });

      actions$.next(
        TodoActions.toggleTodo({
          id: 1,
          completed: false,
        }),
      );
    });

    it('should dispatch failure with previousCompleted', (done) => {
      todoService.toggleTodo.and.returnValue(errorOf('Network error'));

      effects.toggleTodo$.subscribe((action) => {
        expect(action.type).toBe(TodoActions.toggleTodoFailure.type);
        done();
      });

      actions$.next(
        TodoActions.toggleTodo({
          id: 1,
          completed: false,
        }),
      );
    });
  });

  describe('toast effects', () => {
    it('should show success toast on addTodoSuccess', (done) => {
      effects.addTodoSuccess$.subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(jasmine.stringContaining('Learn NgRx'));
        done();
      });

      actions$.next(
        TodoActions.addTodoSuccess({
          todo: mockTodo1,
        }),
      );
    });

    it('should show error toast on addTodoFailure', (done) => {
      effects.addTodoFailure$.subscribe(() => {
        expect(toastService.error).toHaveBeenCalled();
        done();
      });

      actions$.next(
        TodoActions.addTodoFailure({
          error: 'Network error',
        }),
      );
    });

    it('should show completed toast on toggle success', (done) => {
      effects.toggleTodoSuccess$.subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith(jasmine.stringContaining('completed'));
        done();
      });

      actions$.next(
        TodoActions.toggleTodoSuccess({
          id: 1,
          completed: true,
        }),
      );
    });

    it('should show revert toast on toggle failure', (done) => {
      effects.toggleTodoFailure$.subscribe(() => {
        expect(toastService.error).toHaveBeenCalledWith(jasmine.stringContaining('reverted'));
        done();
      });

      actions$.next(
        TodoActions.toggleTodoFailure({
          id: 1,
          previousCompleted: false,
          error: 'Error',
        }),
      );
    });
  });
});

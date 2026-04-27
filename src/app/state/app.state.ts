import { Todo } from '../models/todo.model';
import { User } from '../models/user.model';
import { AuthState } from '../store/auth/auth.state';
import { CounterState } from '../features/counter/store/counter.state';
import { TodoState } from '../features/todos/store/todo.state';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../store/router/custom-route-serializer';

export interface AppState {
  auth: AuthState;
  router: RouterReducerState<RouterStateUrl>;
  ui: {
    theme: 'light' | 'dark';
    sudebarOpen: boolean;
  };
  counter?: CounterState;
  todos?: TodoState;
}

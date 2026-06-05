import { Todo } from '../models/todo.model';
import { User } from '../models/user.model';
import { AuthState } from './auth/auth.state';
import { CounterState } from '../features/counter/store/counter.state';
import { TodoState } from '../features/todos/store/todo.state';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router/custom-route-serializer';

export interface AppState {
  auth: AuthState;
  router: RouterReducerState<RouterStateUrl>;
  counter?: CounterState;
  todos: TodoState;
}

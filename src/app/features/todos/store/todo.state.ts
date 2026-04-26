import { Todo } from '../../../models/todo.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface TodoState extends EntityState<Todo> {
  loading: boolean;
  error: string | null;
  selectedId: number | null;
  filter: 'all' | 'pending' | 'completed' | 'high';
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => (a.createdAt > b.createdAt ? -1 : 1),
});

export const initialTodoState: TodoState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedId: null,
  filter: 'all',
});

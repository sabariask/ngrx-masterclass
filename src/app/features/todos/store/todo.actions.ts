import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from '../../../models/todo.model';

export const TodoActions = createActionGroup({
  source: 'Todos',
  events: {
    // Load
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Failure': props<{ error: string }>(),

    // Add
    'Add Todo': props<{
      title: string;
      priority: 'low' | 'medium' | 'high';
      description: string;
    }>(),
    'Add Todo Success': props<{ todo: Todo }>(),
    'Add Todo Failure': props<{ error: string }>(),

    // Delete
    'Delete Todo': props<{ id: number }>(),
    'Delete Todo Success': props<{ id: number }>(),
    'Delete Todo Failure': props<{ error: string }>(),

    //Toggle
    'Toggle Todo': props<{ id: number; completed: boolean }>(),
    'Toggle Todo Success': props<{ id: number; completed: boolean }>(),
    'Toggle Todo Failure': props<{ id: number; previousCompleted: boolean; error: string }>(),

    //Update Title
    'Update Todo Title': props<{ id: number; title: string }>(),
    'Update Todo Titile Success': props<{ todo: Todo }>(),
    'Update Todo Titile Failure': props<{ id: number; previousTitle: string; error: string }>(),
    
    'Clear All Todos': emptyProps(),

    'Set Filter': props<{ filter: 'all' | 'pending' | 'completed' | 'high' }>(),
    'Select Todo': props<{ id: number }>(),
  },
});

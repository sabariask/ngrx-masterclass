import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { AuthActions } from './auth/auth.actions';
import { isDevMode } from '@angular/core';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const UndoAction = { type: '[History] Undo' } as const;
export const RedoAction = { type: '[History] Redo' } as const;

const UNDOABLE_ACTIONS = [
  '[Todos] Toggle Todo',
  '[Todos] Update Todo Title',
  '[Todos] Clear All Todos',
];

export function loggerMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const skipActions = [
      '@ngrx/store/init',
      '@ngrx/effects/init',
      '@ngrx/router-store/request',
      '@ngrx/router-store/navigation',
      '@ngrx/router-store/navigated',
    ];

    const shouldLog = !skipActions.includes(action.type);

    if (shouldLog) {
      console.log(`%c ACTION: ${action.type}`, 'color: #e94560; font-weight: bold');
      console.log('%c prev state', 'color: #9E9E9E', state);
      console.log('%c action', 'color: #03A9FA', action);
    }

    const newState = reducer(state, action);
    if (shouldLog) {
      console.log('%c next state', 'color: #4CAF50', newState);
      console.groupEnd();
    }
    return newState;
  };
}

const PERSIST_ACTIONS = [
  '[Todos] Add Todo Success',
  '[Todos] Delete Todo Success',
  '[Todos] Toggle Todo Success',
  '[Todos] Update Todo Title Success',
  '[Todos] Load Todos Success',
  '[Counter] Increment',
  '[Counter] Decrement',
  '[Counter] Reset',
];

export function hydrationMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    if (action.type === '@ngrx/store/init') {
      try {
        const saved = localStorage.getItem('ngrx_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('State restored from localStorage');
          return reducer(parsed, action);
        }
      } catch (err) {
        console.warn('Failed to restore state:', err);
        localStorage.removeItem('ngrx_state');
      }
    }
    const newState = reducer(state, action);
    if (PERSIST_ACTIONS.includes(action.type)) {
      try {
        const stateToSave = {
          todos: newState.todos,
          counter: newState.counter,
        };
        localStorage.setItem('ngrx_state', JSON.stringify(stateToSave));
      } catch (err) {
        console.warn('Failed to save state: ', err);
      }
    }

    return newState;
  };
}

export function clearStateMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    if (action.type === AuthActions.logoutSuccess.type) {
      console.log('Clearing state on logout');
      localStorage.removeItem('ngrx_state');
      return reducer(undefined, action);
    }
    return reducer(state, action);
  };
}

export function immutabilityMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const prevState = state;
    const newState = reducer(state, action);
    if (prevState === newState && action.type !== '@ngrx/store/init') {
      // State reference unchanged — either:
      // 1. Nothing changed (fine for unknown actions)
      // 2. State was mutated (bug!)
      // We cannot distinguish here — just log on known mutations
    }
    if (newState && typeof newState === 'object') {
      Object.keys(newState).forEach((key) => {
        const slice = (newState as any)[key];
        if (slice && typeof slice === 'object') {
          // Could deep freeze here — but expensive
          // NgRx DevTools handles this better
        }
      });
    }
    return newState;
  };
}

export function undoRedoMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  let history: HistoryState<AppState> | null = null;
  return (state, action) => {
    if (!history) {
      const initial = reducer(state, action);
      history = { past: [], present: initial, future: [] };
      return initial;
    }

    if (action.type === '[History] Undo') {
      if (history.past.length === 0) {
        return history.present;
      }
      const previous = history.past[history.past.length - 1];
      history = {
        past: history.past.slice(0, -1),
        present: previous,
        future: [history.present, ...history.future],
      };
      console.log('Undo performed');
      return previous;
    }

    if (action.type === '[History] Redo') {
      if (history.future.length === 0) {
        return history.present;
      }
      const next = history.future[0];
      history = {
        past: [...history.past, history.present],
        present: next,
        future: history.future.slice(1),
      };
      console.log('Redo performed');
      return next;
    }
    const newState = reducer(state, action);
    if (UNDOABLE_ACTIONS.includes(action.type)) {
      history = {
        past: [...history.past, history.present],
        present: newState,
        future: [],
      };
    } else {
      history = { ...history, present: newState };
    }
    return newState;
  };
}

export const metaReducers: MetaReducer<AppState>[] = !isDevMode()
  ? [clearStateMetaReducer, hydrationMetaReducer]
  : [loggerMetaReducer, clearStateMetaReducer, hydrationMetaReducer, undoRedoMetaReducer];

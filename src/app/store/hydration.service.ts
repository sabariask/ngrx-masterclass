import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';

@Injectable({ providedIn: 'root' })
export class HydrationService {
  private readonly SRTORAGE_KEY = 'ngrx_app_state';
  private readonly VERSION_KEY = 'ngrx_state_version';
  private readonly CURRENT_VERSION = '1.0.0';

  saveState(state: AppState): void {
    try {
      const stateToSave = this.selectPresistableState(state);
      const payload = {
        version: this.CURRENT_VERSION,
        timestamp: new Date().toISOString(),
        state: stateToSave,
      };
      localStorage.setItem(this.SRTORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('State failed save', err);
    }
  }

  loadState(): Partial<AppState> | null {
    try {
      const raw = localStorage.getItem(this.SRTORAGE_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);

      if (payload.version !== this.CURRENT_VERSION) {
        console.warn('Saved state version mismatch');
        this.clearState();
        return null;
      }
      const saved = new Date(payload.timestamp);
      const now = new Date();
      const daysDiff = (now.getTime() - saved.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > 7) {
        console.warn('Saved state expired . Starting fresh.');
        this.clearState();
        return null;
      }
      return payload.state;
    } catch (err) {
      console.warn('Saved state expired. Starting fresh.');
      this.clearState();
      return null;
    }
  }

  clearState(): void {
    localStorage.removeItem(this.SRTORAGE_KEY);
  }

  private selectPresistableState(state: AppState) {
    return {
      todos: {
        ids: state.todos.ids,
        entities: state.todos.entities,
        filter: state.todos.filter,
        loading: false,
        error: null,
      },
      counter: state.counter,
    };
  }

  hasPersistedState(): boolean {
    return localStorage.getItem(this.SRTORAGE_KEY) != null;
  }
}

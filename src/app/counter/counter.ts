import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterService } from '../services/counter-service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as CounterSelectors from '../state/counter/counter.selectors';
import * as CounterActions from '../state/counter/counter.actions';
import { TodoActions } from '../state/todos/todo.actions';
import { AuthActions } from '../state/auth/auth.actions';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  private store = inject(Store<AppState>);
  count$: Observable<number> = this.store.select(CounterSelectors.selectCount);
  isPositive$: Observable<boolean> = this.store.select(CounterSelectors.selectIsPositive);
  isNegative$: Observable<boolean> = this.store.select(CounterSelectors.selectIsNegative);
  lastUpdated$: Observable<string | null> = this.store.select(CounterSelectors.selectLastUpdated);
  summary$: Observable<any> = this.store.select(CounterSelectors.selectCounterSummary);

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }

  reset() {
    this.store.dispatch(CounterActions.reset());
  }

  incrementBy(amount: number) {
    this.store.dispatch(CounterActions.incrementBy({ amount }));
  }

  decrementBy(amount: number) {
    this.store.dispatch(CounterActions.decrementBy({ amount }));
  }
}

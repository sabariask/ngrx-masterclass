import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  isPositive$ = new BehaviorSubject<boolean>(false);
  count$ = new BehaviorSubject<number>(0);

  increment() {
    const count = this.count$.value + 1;
    this.count$.next(count);
    this.isPositive$.next(count > 0);
  }

  decrement() {
   const count = this.count$.value - 1;
    this.count$.next(count);
    this.isPositive$.next(count > 0);
  }

  reset() {
    this.count$.next(0);
    this.isPositive$.next(false);
  }
}

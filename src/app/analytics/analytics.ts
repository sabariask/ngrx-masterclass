import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable } from 'rxjs';
import { selectAnalyticsViewModel } from '../store/analytics/analytics.selectors';
import { TodoActions } from '../features/todos/store/todo.actions';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
  standalone: true,
})
export class Analytics implements OnInit {
  vm$!: Observable<any>;

  store = inject(Store);

  constructor() {
    this.vm$ = this.store
      .select(selectAnalyticsViewModel)
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev.counts.total === curr.counts.total &&
            prev.counts.completed === curr.counts.completed &&
            prev.productivityScore === curr.productivityScore,
        ),
      );
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }
}

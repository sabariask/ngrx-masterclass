import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Todo } from '../models/todo.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';
import { TodoService } from '../services/todo.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as dashboardSelectors from '../state/dashboard/dashboard.selectors';
import { TodoActions } from '../../app/features/todos/store/todo.actions';
import { AuthActions } from '../store/auth/auth.actions';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements  OnInit{
  store = inject(Store<AppState>);
  vm$: Observable<any> = this.store.select(dashboardSelectors.selectDashboardViewModel);

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
    this.store.dispatch(AuthActions.loadProfile());
  }
}

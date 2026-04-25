import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Toast } from './shared/toast/toast';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectUserName } from './store/auth/auth.selectors';
import { AuthActions } from './store/auth/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Toast, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string>;

  store = inject(Store);
  constructor() {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userName$ = this.store.select(selectUserName);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}

import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  store = inject(Store);

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.errorMessage = '';
    this.store.dispatch(
      AuthActions.login({
        email: this.email,
        password: this.password,
      }),
    );
  }

  quickLogin() {
    this.store.dispatch(
      AuthActions.login({
        email: 'sana@example.com',
        password: 'password@123',
      }),
    );
  }
}

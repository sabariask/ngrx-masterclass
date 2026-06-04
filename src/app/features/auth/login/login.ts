import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../../../store/auth/auth.facade';

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

  authFacade = inject(AuthFacade);

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.errorMessage = '';
    this.authFacade.login(this.email, this.password);
  }

  quickLogin() {
    this.authFacade.login('sana@example.com', 'password@123');
  }
}

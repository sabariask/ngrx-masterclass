import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { JwtService } from './jwt';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  tokenExpiry: number;
}

export interface RefreshResponse {
  token: string;
  tokenExpiry: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private jwtService = inject(JwtService);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map((users) => {
        const user = users[0];
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const token = this.jwtService.generateMockToken(user.id, 120);
        const refreshToken = this.jwtService.generateMockRefreshToken();
        const tokenExpiry = this.jwtService.getTokenExpiry(token) ?? 0;

        return { user, token, refreshToken, tokenExpiry };
      }),
    );
  }

  refreshToken(refreshToken: string) {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newToken = this.jwtService.generateMockToken(1, 900);
        const tokenExpiry = this.jwtService.getTokenExpiry(newToken) ?? 0;
        return { token: newToken, tokenExpiry };
      }),
    );
  }

  getMockUser(): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(map((users) => users[0]));
  }
}

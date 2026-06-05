import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  getTokenExpiry(token: string) {
    const decoded = this.decodeToken(token);
    return decoded?.exp ?? null;
  }

  isTokenExpired(token: string): boolean {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return nowInSeconds >= expiry;
  }

  isTokenExpiringSoon(token: string, bufferSeconds = 60) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const secondsLeft = expiry - nowInSeconds;
    return secondsLeft <= bufferSeconds;
  }

  generateMockToken(userId: number, expiresInSeconds = 900) {
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + expiresInSeconds;

    const header = btoa(
      JSON.stringify({
        alg: 'HS256',
        typ: 'JWT',
      }),
    );

    const payload = btoa(
      JSON.stringify({
        userId,
        iat: now,
        exp: expiry,
      }),
    );

    const signature = btoa('mock-signature');

    return `${header}.${payload}.${signature}`;
  }

  generateMockRefreshToken() {
    return `refresh-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

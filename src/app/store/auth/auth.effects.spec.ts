import { of, ReplaySubject, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthEffects } from '../auth/auth.effects';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { AuthActions } from './auth.actions';

const mockuser: User = {
  id: 1,
  name: 'Sana',
  email: 'sana@example.com',
  role: 'admin',
  avatarUrl: 'https://i.pravatar.cc/100',
  createdAt: '2025-02-01',
};

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let actions$: ReplaySubject<any>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['getMockUser']);
    router = jasmine.createSpyObj('Router', ['navigate'], { url: '/login' });
    actions$ = new ReplaySubject<any>(1);

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') return null;
      if (key === 'auth_user') return null;
      return null;
    });
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        provideMockStore({}),
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('InitAuth$', () => {
    it('should dispatch logoutSuccess when no token', (done) => {
      actions$.next({ type: ROOT_EFFECTS_INIT });
      effects.initAuth$.subscribe((action) => {
        expect(action.type).toEqual(AuthActions.logoutSuccess.type);
        done();
      });
    });

    it('should dispatch loginSuccess when token exists', (done) => {
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'auth_token') return 'mock-token';
        if (key === 'auth_user') return JSON.stringify(mockuser);
        return null;
      });

      actions$.next({ type: ROOT_EFFECTS_INIT });
      effects.initAuth$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginSuccess.type);
        const loginAction = action as ReturnType<typeof AuthActions.loginSuccess>;
        expect(loginAction.user).toEqual(mockuser);
        expect(loginAction.token).toBe('mock-token');
        done();
      });
    });
  });

  describe('login$', () => {
    it('should dispatch loginSuccess on success', (done) => {
      userService.getMockUser.and.returnValue(of(mockuser));
      actions$.next(
        AuthActions.login({
          email: 'sana@test.com',
          password: '123',
        }),
      );
      effects.login$.subscribe((action) => {
        expect(action.type).toEqual(AuthActions.loginSuccess.type);
        const loginAction = action as ReturnType<typeof AuthActions.loginSuccess>;
        expect(loginAction.user).toEqual(mockuser);
        expect(loginAction.token).toContain('mock-jwt-');
        done();
      });
    });

    it('should dispatch loginFailure on error', (done) => {
      userService.getMockUser.and.returnValue(throwError(() => new Error('Auth failed')));

      actions$.next(
        AuthActions.login({
          email: 'wrong@test.com',
          password: 'wrong',
        }),
      );

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        const loginAction = action as ReturnType<typeof AuthActions.loginFailure>;
        expect(loginAction.error).toBe('Auth failed');
        done();
      });
    });
  });

  describe('saveToken$', () => {
    it('should save token to localStorage on loginSuccess', (done) => {
      actions$.next(
        AuthActions.loginSuccess({
          user: mockuser,
          token: 'jwt-abc',
        }),
      );

      effects.saveToken$.subscribe(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'jwt-abc');
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(mockuser));
        done();
      });
    });
  });

  describe('loginRedirect$', () => {
    it('should navigate to dashboard from login page', (done) => {
      actions$.next(
        AuthActions.loginSuccess({
          user: mockuser,
          token: 'jwt-123',
        }),
      );

      effects.loginRedirect$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
        done();
      });
    });

    it('should NOT navigate when not on login page', (done) => {
      Object.defineProperty(router, 'url', {
        value: '/dashboard',
        writable: true,
      });

      actions$.next(
        AuthActions.loginSuccess({
          user: mockuser,
          token: 'jwt-123',
        }),
      );

      effects.loginRedirect$.subscribe(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('logout$', () => {
    it('should dispatch logoutSuccess on logout', (done) => {
      actions$.next(AuthActions.logout());
      effects.logout$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.logoutSuccess.type);
        done();
      });
    });
  });
});

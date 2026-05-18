import { User } from '../../models/user.model';
import { authReducer } from '../auth/auth.reducer';
import { AuthActions } from './auth.actions';
import { clearAuthState, initialAuthState } from './auth.state';

const mockUser: User = {
  id: 1,
  name: 'Sana',
  email: 'sana@example.com',
  role: 'admin',
  avatarUrl: 'https://i.pravatar.cc/100',
  createdAt: '2024-01-01',
};

describe('authReducer', () => {
  it('should return initial state', () => {
    const action = { type: 'UNKNOWN' };
    const state = authReducer(undefined, action);
    expect(state).toEqual(initialAuthState);
  });

  describe('login', () => {
    it('should set loding to true', () => {
      const action = AuthActions.login({
        email: 'test@test.com',
        password: '123',
      });
      const state = authReducer(initialAuthState, action);
      expect(state.loading).toEqual(true);
    });

    it('should clear error when login starts', () => {
      const errorState = {
        ...initialAuthState,
        error: 'Invalid credentials',
      };
      const action = AuthActions.login({
        email: 'test@test.com',
        password: '123',
      });
      const state = authReducer(errorState, action);
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    it('should set isLoggedIn to true', () => {
      const action = AuthActions.loginSuccess({
        user: mockUser,
        token: 'jwt-123',
      });
      const state = authReducer(initialAuthState, action);
      expect(state.isLoggedIn).toBeTruthy();
    });

    it('should store user and token', () => {
      const action = AuthActions.loginSuccess({
        user: mockUser,
        token: 'jwt-123',
      });
      const state = authReducer(initialAuthState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual('jwt-123');
    });
  });

  describe('loginFailure', () => {
    it('should store error message', () => {
      const action = AuthActions.loginFailure({
        error: 'Invalid Credentials',
      });
      const state = authReducer(initialAuthState, action);
      expect(state.error).toEqual('Invalid Credentials');
    });
    it('Should set isLoggedIn to false', () => {
      const action = AuthActions.loginFailure({
        error: 'Error',
      });
      const state = authReducer(initialAuthState, action);
      expect(state.isLoggedIn).toBeFalsy();
    });
  });

  describe('logoutSuccess', () => {
    it('should reset to clearedAuthState', () => {
      const loggedInState = authReducer(
        initialAuthState,
        AuthActions.loginSuccess({
          user: mockUser,
          token: 'jwt',
        }),
      );
      expect(loggedInState.isLoggedIn).toBeTruthy();

      const action = AuthActions.logoutSuccess();
      const finalState = authReducer(loggedInState, action);
      expect(finalState).toEqual(clearAuthState);
    });
  });
});

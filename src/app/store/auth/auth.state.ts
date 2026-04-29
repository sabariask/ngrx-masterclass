import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true,
  error: null,
  initialized: false,
};

export const clearAuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  initialized: true,
};

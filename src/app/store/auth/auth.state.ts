import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isRefreshing: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true,
  error: null,
  initialized: false,
  isRefreshing: false,
  tokenExpiry: null,
  refreshToken: null
};

export const clearAuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  initialized: true,
  isRefreshing: false,
  tokenExpiry: null,
  refreshToken: null
};

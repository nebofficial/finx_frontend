import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  tenant_id?: string;
  branch_id?: string;
  type?: 'platform' | 'tenant';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!Cookies.get('auth_token'),
  isLoading: false,

  login: (token, refreshToken, userData) => {
    Cookies.set('auth_token', token, { expires: 1 }); // 1 day
    if (refreshToken) Cookies.set('refresh_token', refreshToken, { expires: 7 });
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/sign-in';
  },

  setUser: (user) => set({ user }),
}));

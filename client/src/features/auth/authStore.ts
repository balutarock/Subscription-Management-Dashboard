import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserRole = 'user' | 'admin';

export type SubscriptionStatus = 'active' | 'expired' | 'none';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  subscription?: {
    status: SubscriptionStatus;
    planId?: string;
    currentPeriodEnd?: string;
  };
};

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  clearAuthState: () => void;
  checkSession: () => Promise<boolean>;
  refreshAuthToken: () => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  hasSubscription: () => boolean;
  getSubscriptionStatus: () => SubscriptionStatus;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        // In a real app, you would call your logout API here
        get().clearAuthState();
      },

      clearAuthState: () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      checkSession: async () => {
        const { token, refreshToken } = get();
        if (!token || !refreshToken) return false;

        try {
          // In a real app, you would validate the token with your backend
          return true;
        } catch (error) {
          console.error('Session check failed:', error);
          get().clearAuthState();
          return false;
        }
      },

      refreshAuthToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          // In a real app, you would call your refresh token endpoint
          // const response = await api.refreshToken(refreshToken);
          // set({ token: response.token, refreshToken: response.refreshToken });
          return true;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          get().clearAuthState();
          return false;
        }
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.roles.includes(role) || false;
      },

      hasSubscription: () => {
        const { user } = get();
        return user?.subscription?.status === 'active' || false;
      },

      getSubscriptionStatus: () => {
        const { user } = get();
        return user?.subscription?.status || 'none';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

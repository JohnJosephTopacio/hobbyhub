import { createContext, useContext, useCallback, useMemo } from 'react';
import { setAccessToken, getAccessToken } from '@/auth/accessToken';
type AuthContextType = {
  setToken: (token: string) => void;
  resetToken: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const localAccessToken = getAccessToken();

  const setToken = useCallback((token: string) => {
    setAccessToken(token);
  }, []);

  const resetToken = useCallback(() => {
    setAccessToken(null);
  }, []);

  // Stores object in memory cache so as not to unnecessarily trigger a rerender of every component that consumes the context when AuthProvider re-renders.
  const value = useMemo(
    () => ({ setToken, resetToken, isAuthenticated: localAccessToken !== null }),
    [setToken, resetToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
}

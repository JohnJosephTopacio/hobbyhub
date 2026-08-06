import { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { setAccessToken } from '@/auth/accessToken';
type AuthContextType = {
  localAccessToken: string | null;
  setToken: (token: string) => void;
  resetToken: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [localAccessToken, setLocalAccessToken] = useState<string | null>(null);

  const setToken = useCallback((token: string) => {
    setLocalAccessToken(token);
    setAccessToken(token);
  }, []);

  const resetToken = useCallback(() => {
    setLocalAccessToken(null);
    setAccessToken(null);
  }, []);

  // Stores object in memory cache so as not to unnecessarily trigger a rerender of every component that consumes the context when AuthProvider re-renders.
  const value = useMemo(
    () => ({ localAccessToken, setToken, resetToken, isAuthenticated: localAccessToken !== null }),
    [localAccessToken, setToken, resetToken],
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

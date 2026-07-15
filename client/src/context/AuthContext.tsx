import { createContext, useState, useContext, useCallback, useMemo } from 'react';

type AuthContextType = {
  accessToken: string | null,
  setToken: (token: string) => void,
  resetToken: () => void,
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const setToken = useCallback((token: string) => {
    setAccessToken(token);
  }, []);

  const resetToken = useCallback(() => {
    setAccessToken(null); 
  },[]);

  const isAuthenticated = accessToken !== null;

  const value = useMemo(
    () => ({ accessToken, setToken, resetToken, isAuthenticated}),
    [accessToken, setToken, resetToken, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
}




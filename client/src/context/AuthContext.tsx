import { createContext, useState, useContext, useCallback } from 'react';

type AuthContextType = {
  accessToken: string | null,
  login: (token: string) => void,
  logout: () => void,
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const login = useCallback((token: string) => {
    setAccessToken(token);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null); 
  },[]);

  const isAuthenticated = accessToken !== null;

  return (
    <AuthContext.Provider value={{accessToken, login, logout, isAuthenticated}}>
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




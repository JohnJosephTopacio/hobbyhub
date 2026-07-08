import { createContext, useState, useContext } from 'react';

type AuthContextType = {
  accessToken: string,
  setAccessToken: React.Dispatch<React.SetStateAction<string>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [accessToken, setAccessToken] = useState("");
  return (
    <AuthContext.Provider value={{accessToken, setAccessToken}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error();
  }
  return auth;
}



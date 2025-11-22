import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, type AuthUser } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'rideconnect_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextUser: AuthUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const verifyStoredSession = useCallback(
    async (storedToken: string) => {
      try {
        const response = await api.getCurrentUser(storedToken);
        persistSession(response.user, storedToken);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession, clearSession],
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as { user: AuthUser; token: string };
      if (parsed.token) {
        verifyStoredSession(parsed.token);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to parse stored auth session', error);
      setIsLoading(false);
    }
  }, [verifyStoredSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.login({ email, password });
      persistSession(response.user, response.token);
    },
    [persistSession],
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      const response = await api.signup({ email, password, name });
      persistSession(response.user, response.token);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

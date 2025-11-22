import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem('rideconnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
    };
    
    localStorage.setItem('rideconnect_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    };
    
    localStorage.setItem('rideconnect_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('rideconnect_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthMode = 'read' | 'write';

interface AuthContextType {
  mode: AuthMode;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode>('read');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('authMode');
    if (savedMode === 'write') {
      setMode('write');
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'Admin' && password === 'Aubergine') {
      setMode('write');
      setIsAuthenticated(true);
      localStorage.setItem('authMode', 'write');
      return true;
    }
    return false;
  };

  const logout = () => {
    setMode('read');
    setIsAuthenticated(false);
    localStorage.removeItem('authMode');
  };

  return (
    <AuthContext.Provider value={{ mode, isAuthenticated, login, logout }}>
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

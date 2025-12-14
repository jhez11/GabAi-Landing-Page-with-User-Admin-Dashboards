import React, { useEffect, useState, createContext, useContext, Component } from 'react';
type UserRole = 'user' | 'admin' | null;
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Built-in admin account (hidden from users)
const ADMIN_ACCOUNT = {
  email: 'admin@nemsu.edu.ph',
  password: 'admin123',
  user: {
    id: 'admin-1',
    name: 'Dr. Admin User',
    email: 'admin@nemsu.edu.ph',
    role: 'admin' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
};
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('gabai_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('gabai_user');
      }
    }
    setIsLoading(false);
  }, []);
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
    const emailExists = registeredUsers.some((u: any) => u.email === email) || email === ADMIN_ACCOUNT.email;
    if (emailExists) {
      setIsLoading(false);
      return false;
    }
    // Create new user
    const newUser = {
      email,
      password,
      user: {
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'user' as UserRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      }
    };
    // Store in registered users
    registeredUsers.push(newUser);
    localStorage.setItem('gabai_registered_users', JSON.stringify(registeredUsers));
    setIsLoading(false);
    return true;
  };
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    let authenticatedUser: User | null = null;
    // Check admin account
    if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
      authenticatedUser = ADMIN_ACCOUNT.user;
    } else {
      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
      const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        authenticatedUser = foundUser.user;
      }
    }
    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem('gabai_user', JSON.stringify(authenticatedUser));
      setIsLoading(false);
      // Navigate based on role
      setTimeout(() => {
        window.location.href = authenticatedUser.role === 'admin' ? '/admin' : '/dashboard';
      }, 100);
      return true;
    }
    setIsLoading(false);
    return false;
  };
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update user object
      const updatedUser = {
        ...user,
        ...updates
      };
      // Update localStorage
      localStorage.setItem('gabai_user', JSON.stringify(updatedUser));
      // Update registered users list if not admin
      if (user.role !== 'admin') {
        const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
        const updatedUsers = registeredUsers.map((u: any) => u.user.id === user.id ? {
          ...u,
          user: updatedUser
        } : u);
        localStorage.setItem('gabai_registered_users', JSON.stringify(updatedUsers));
      }
      // Update state
      setUser(updatedUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('gabai_user');
    window.location.href = '/';
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  }}>
      {children}
    </AuthContext.Provider>;
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
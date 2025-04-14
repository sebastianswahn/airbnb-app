"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our auth system
interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

// Login result type
interface LoginResult {
  success: boolean;
  error?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  isAuthenticated: boolean;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response | null>;
  // Phone authentication methods
  loginWithPhone: (phone: string, otp: string) => Promise<LoginResult>;
  sendOTP: (phone: string) => Promise<boolean>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token utilities
const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data on initial mount
  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const token = getToken();
        if (token) {
          // Fetch user profile with the token
          const response = await fetchWithAuth('/api/users/me');
          
          if (response && response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token might be invalid, clear it
            removeToken();
            setUser(null);
          }
        } else {
          // No token found
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  // Helper function for authenticated fetches
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
    const token = getToken();
    
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    } as Record<string, string>;
    
    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers,
    };
    
    try {
      const response = await fetch(url, config);
      
      // If unauthorized and not already on login page, redirect to login
      if (response.status === 401 && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Store the current page URL to redirect back after login
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== '/' && !currentPath.includes('/login')) {
          localStorage.setItem('redirectAfterLogin', currentPath);
        }
        
        window.location.href = '/login';
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Send OTP function - using the correct API route
  const sendOTP = async (phone: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Updated to use the correct API path
      const response = await fetch('/api/users/phone/getotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      console.error('OTP error:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with phone function - using the correct API route
  const loginWithPhone = async (phone: string, otp: string): Promise<LoginResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // Updated to use the correct API path
      const response = await fetch('/api/users/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to verify OTP');
      }
      
      const data = await response.json();
      
      // Save the token and user data
      saveToken(data.token);
      setUser(data.user);
      
      // Check if there's a redirect URL saved
      if (typeof window !== 'undefined') {
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectUrl;
        }
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    setUser(null);
    
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Provide the auth context value
  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    logout,
    isAuthenticated,
    fetchWithAuth,
    loginWithPhone,
    sendOTP
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
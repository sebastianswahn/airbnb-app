"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  // Email login method
  loginWithEmail: (email: string, password: string) => Promise<LoginResult>;
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

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authCheckInProgress, setAuthCheckInProgress] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  const [lastCheckStatus, setLastCheckStatus] = useState<number | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(0);

  // Debug function to check cookies
  const debugCookies = useCallback(() => {
    if (typeof document !== 'undefined') {
      console.log('🍪 Current cookies:', document.cookie);
    }
  }, []);

  // Function to check authentication status with backoff for errors
  const checkAuthStatus = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime;
    
    // Don't check if:
    // 1. A check is already in progress
    // 2. Last check was less than 5 seconds ago (unless forced)
    // 3. We've had 3+ consecutive 404 failures (wait 30 seconds before trying again)
    if (
      authCheckInProgress || 
      (!force && timeSinceLastCheck < 5000) ||
      (lastCheckStatus === 404 && consecutiveFailures >= 3 && timeSinceLastCheck < 30000)
    ) {
      return;
    }
    
    setAuthCheckInProgress(true);
    console.log('🔄 Checking authentication state...');
    debugCookies();
    
    try {
      // FIXED: Use the correct endpoint path - /api/auth/me instead of /api/users/me
      console.log('📡 Fetching user profile from /api/auth/me');
      const response = await fetch('/api/auth/me', {
        credentials: 'include' as RequestCredentials,
      });
      
      console.log('📡 /api/auth/me response status:', response.status);
      setLastCheckTime(now);
      setLastCheckStatus(response.status);
      
      if (response.status === 404) {
        setConsecutiveFailures(prev => prev + 1);
        console.warn(`⚠️ Endpoint not found (404). Attempt ${consecutiveFailures + 1}. Will back off after 3 failures.`);
      } else {
        setConsecutiveFailures(0);
      }
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User authenticated successfully:', userData);
        setUser(userData);
      } else {
        console.log('❌ Not authenticated or error:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
      setUser(null);
      setLastCheckTime(now);
      setConsecutiveFailures(prev => prev + 1);
    } finally {
      setLoading(false);
      setAuthCheckInProgress(false);
      console.log('🔄 Authentication check complete. User state:', user ? 'Authenticated' : 'Not authenticated');
    }
  }, [authCheckInProgress, consecutiveFailures, debugCookies, lastCheckStatus, lastCheckTime, user]);

  // Load user data on initial mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Set up session refresh - periodically ping server to keep session alive
  useEffect(() => {
    // Only set up refresh if user is authenticated
    if (!user) return;

    console.log("🔄 Setting up session refresh mechanism");
    
    // Ping the server every 10 minutes to keep the session alive
    const refreshInterval = setInterval(async () => {
      try {
        console.log("🔄 Refreshing authentication session...");
        // Simple call to check auth status - will refresh the cookie lifetime
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log("✅ Authentication session refreshed");
          // Only check auth status if we've had failures or it's been a while
          if (consecutiveFailures > 0 || Date.now() - lastCheckTime > 5 * 60 * 1000) {
            checkAuthStatus(true); // Force check
          }
        } else {
          console.warn("⚠️ Failed to refresh authentication session");
        }
      } catch (error) {
        console.error("❌ Error refreshing session:", error);
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    return () => {
      console.log("🛑 Clearing session refresh interval");
      clearInterval(refreshInterval);
    };
  }, [user, checkAuthStatus, consecutiveFailures, lastCheckTime]);

  // Set up auth error detection and recovery
  useEffect(() => {
    // Listen for 401 errors from fetch requests
    const handleAuthErrors = (event: CustomEvent) => {
      console.warn("⚠️ Authentication error detected, attempting to recover session...");
      
      // Try to refresh the session
      fetch('/api/auth/check', { credentials: 'include' })
        .then(response => {
          if (!response.ok) {
            console.error("❌ Session recovery failed, redirecting to login");
            // Clear user state
            setUser(null);
            // Redirect to login if recovery fails
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          } else {
            console.log("✅ Session recovered successfully");
            // Check auth status again WITHOUT auto-retrying if it fails
            fetch('/api/auth/me', { credentials: 'include' })
              .then(userResponse => {
                if (userResponse.ok) {
                  return userResponse.json().then(userData => {
                    setUser(userData);
                    console.log('✅ User data refreshed after recovery');
                  });
                }
              })
              .catch(e => console.error('Error fetching user after recovery:', e));
          }
        })
        .catch(error => {
          console.error("❌ Error during session recovery:", error);
          setUser(null);
        });
    };
    
    // Create custom event for auth errors
    window.addEventListener('auth:error', handleAuthErrors as EventListener);
    
    return () => {
      window.removeEventListener('auth:error', handleAuthErrors as EventListener);
    };
  }, []);

  // Helper function for authenticated fetches
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
    console.log(`📡 Making authenticated request to: ${url}`);
    debugCookies();
    
    const config: RequestInit = {
      ...options,
      credentials: 'include' as RequestCredentials,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
      },
    };
    
    try {
      const response = await fetch(url, config);
      console.log(`📡 Response from ${url}:`, response.status);
      
      // If unauthorized
      if (response.status === 401) {
        console.error('🔒 Unauthorized (401) response received');
        // Dispatch custom event for auth errors
        window.dispatchEvent(new CustomEvent('auth:error', { 
          detail: { status: 401, url } 
        }));
        
        // Store the current page URL to redirect back after login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          const currentPath = window.location.pathname + window.location.search;
          if (currentPath !== '/' && !currentPath.includes('/login')) {
            console.log('💾 Saving redirect path:', currentPath);
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
        }
        
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  };

  // Send OTP function
  const sendOTP = async (phone: string): Promise<boolean> => {
    console.log(`📱 Sending OTP to phone: ${phone}`);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users/phone/getotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      console.log('📱 OTP request response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.error('❌ OTP send error:', data);
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      console.log('✅ OTP sent successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      console.error('❌ OTP error:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with phone function
  const loginWithPhone = async (phone: string, otp: string): Promise<LoginResult> => {
    console.log(`📱 Attempting phone login for: ${phone} with OTP: ${otp}`);
    setLoading(true);
    setError(null);
    debugCookies();
    
    try {
      const response = await fetch('/api/users/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
        body: JSON.stringify({ phone, otp }),
      });
      
      console.log('📱 Phone login response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.error('❌ Phone login error:', data);
        throw new Error(data.error || 'Failed to verify OTP');
      }
      
      const data = await response.json();
      console.log('✅ Phone login successful. Response data:', data);
      
      // Save user data from response
      setUser(data.user);
      console.log('👤 User state updated:', data.user);
      
      // Check cookies after login
      setTimeout(debugCookies, 100);
      
      // Handle redirect after login
      handleRedirectAfterLogin();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      console.error('❌ Login error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login with email function
  const loginWithEmail = async (email: string, password: string): Promise<LoginResult> => {
    console.log(`📧 Attempting email login for: ${email}`);
    setLoading(true);
    setError(null);
    debugCookies();
    
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📧 Email login response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.error('❌ Email login error:', data);
        throw new Error(data.error || 'Invalid credentials');
      }
      
      const data = await response.json();
      console.log('✅ Email login successful. Response data:', data);
      
      // Save user data from response
      setUser(data.user);
      console.log('👤 User state updated:', data.user);
      
      // Check cookies after login
      setTimeout(debugCookies, 100);
      
      // Handle redirect after login
      handleRedirectAfterLogin();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      console.error('❌ Login error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Handle redirect after successful login
  const handleRedirectAfterLogin = () => {
    if (typeof window !== 'undefined') {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        console.log('🔄 Redirecting after login to:', redirectUrl);
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
        console.log('ℹ️ No redirect URL found after login');
      }
    }
  };

  // Logout function
  const logout = async () => {
    console.log('🚪 Logging out...');
    debugCookies();
    
    try {
      // Call logout API to clear the cookie on server
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' as RequestCredentials,
      });
      
      console.log('🚪 Logout response status:', response.status);
      
      // Clear user state
      setUser(null);
      console.log('👤 User state cleared');
      
      // Check cookies after logout
      setTimeout(debugCookies, 100);
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        console.log('🔄 Redirecting to home page after logout');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Log authentication state changes
  useEffect(() => {
    console.log('👤 Authentication state changed:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
    if (user) {
      console.log('👤 Current user:', user);
    }
  }, [user, isAuthenticated]);

  // Provide the auth context value
  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    logout,
    isAuthenticated,
    fetchWithAuth,
    loginWithPhone,
    sendOTP,
    loginWithEmail
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
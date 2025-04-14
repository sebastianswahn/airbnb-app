// Client-side utilities for handling authentication

// Save the token to localStorage after login
export const saveToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  // Get the stored token
  export const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };
  
  // Remove the token (logout)
  export const removeToken = () => {
    localStorage.removeItem('authToken');
  };
  
  // Check if the user is logged in
  export const isLoggedIn = () => {
    return !!getToken();
  };
  
  // Add the auth token to fetch requests
  export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
    
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
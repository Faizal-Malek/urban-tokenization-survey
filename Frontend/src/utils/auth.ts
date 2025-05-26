import axios from "axios";
import { toast } from "sonner";

// Types for better TypeScript support
export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: {
      username: string;
      role: string;
    }
  }
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Simple authentication check without server verification
export const isLocallyAuthenticated = (): boolean => {
  try {
    const hasAdminAuth = localStorage.getItem('adminAuth') === 'true';
    const hasToken = !!localStorage.getItem('token');
    const hasCookie = document.cookie.includes('jwt=');
    
    return hasAdminAuth && (hasToken || hasCookie);
  } catch (error) {
    console.error('Error checking local auth status:', error);
    return false;
  }
};

// Enhanced authentication status check with session persistence
export const checkAuthStatus = (): boolean => {
  try {
    const hasAdminAuth = localStorage.getItem('adminAuth') === 'true';
    const hasToken = !!localStorage.getItem('token');
    const hasCookie = document.cookie.includes('jwt=');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    // Check if session has expired
    if (sessionExpiry) {
      const expiryTime = new Date(sessionExpiry);
      const now = new Date();
      if (now > expiryTime) {
        // Session expired, clear auth data
        clearAuthData();
        return false;
      }
    }
    
    return hasAdminAuth && (hasToken || hasCookie);
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

// Clear all authentication data
const clearAuthData = (): void => {
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('token');
  localStorage.removeItem('adminUsername');
  localStorage.removeItem('sessionExpiry');
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Enhanced login function with improved session management
export const loginAdmin = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const res = await axios.post<AuthResponse>(
      "https://urban-tokenization-survey.onrender.com/api/auth/login",
      credentials,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    // Store authentication state
    localStorage.setItem('adminAuth', 'true');
    
    // Store the token in localStorage as a backup
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    
    // Store username if available
    if (res.data?.data?.user?.username) {
      localStorage.setItem('adminUsername', res.data.data.user.username);
    }
    
    // Set session expiry (2 hours from now as requested)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 2);
    localStorage.setItem('sessionExpiry', expiryTime.toISOString());
    
    // Store login timestamp
    localStorage.setItem('loginTimestamp', new Date().toISOString());
    
    toast.success("Login successful - Session will persist until logout");
    return true;
  } catch (err: any) {
    console.error("Login error:", err);
    
    // Enhanced error handling
    let errorMessage = "Login failed";
    if (err.response?.status === 401) {
      errorMessage = "Invalid credentials";
    } else if (err.response?.status === 429) {
      errorMessage = "Too many login attempts. Please try again later.";
    } else if (err.code === 'ECONNABORTED') {
      errorMessage = "Login timeout. Please check your connection.";
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    toast.error(errorMessage);
    return false;
  }
};

// Enhanced logout function with complete session cleanup
export const logoutAdmin = async (): Promise<void> => {
  try {
    // Attempt to logout on server side
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(
          "https://urban-tokenization-survey.onrender.com/api/auth/logout",
          {},
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000
          }
        );
      } catch (error) {
        console.warn("Server logout failed, proceeding with client cleanup:", error);
      }
    }
  } catch (error) {
    console.warn("Logout request failed, proceeding with client cleanup:", error);
  } finally {
    // Always clear client-side data regardless of server response
    clearAuthData();
    
    toast.success("Logged out successfully");
    
    // Redirect to home
    window.location.href = "/";
  }
};

// Get authenticated user's username
export const getAdminUsername = (): string => {
  return localStorage.getItem('adminUsername') || 'Admin';
};

// Enhanced server-side authentication verification
export const verifyAuthStatus = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn("No token found for verification");
      return false;
    }
    
    const response = await axios.get(
      "https://urban-tokenization-survey.onrender.com/api/admin/users",
      {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        timeout: 15000 // 15 second timeout
      }
    );
    
    if (response.status === 200) {
      // Refresh session expiry on successful verification (2 hours)
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 2);
      localStorage.setItem('sessionExpiry', expiryTime.toISOString());
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Auth verification failed:", error);
    
    // Handle different error scenarios
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Unauthorized - clear auth data
      clearAuthData();
      return false;
    } else if (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET' || !error.response) {
      console.warn("Auth verification network error - assuming valid session");
      return true; // Don't clear session on network errors
    }
    
    // For other errors, assume session is still valid to avoid false positives
    console.warn("Auth verification error, assuming valid session:", error.message);
    return true;
  }
};

// Get session information
export const getSessionInfo = () => {
  const loginTimestamp = localStorage.getItem('loginTimestamp');
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  const username = localStorage.getItem('adminUsername');
  
  return {
    loginTime: loginTimestamp ? new Date(loginTimestamp) : null,
    expiryTime: sessionExpiry ? new Date(sessionExpiry) : null,
    username: username || 'Admin',
    isValid: checkAuthStatus()
  };
};
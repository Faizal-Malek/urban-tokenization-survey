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

// Check if user is already authenticated
export const checkAuthStatus = (): boolean => {
  const hasAdminAuth = localStorage.getItem('adminAuth') === 'true';
  const hasToken = !!localStorage.getItem('token');
  const hasCookie = document.cookie.includes('jwt=');
  
  return hasAdminAuth && (hasToken || hasCookie);
};

// Login function that can be shared across admin components
export const loginAdmin = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const res = await axios.post<AuthResponse>(
      "https://urban-tokenization-survey.onrender.com/api/auth/login",
      credentials,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
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
    
    toast.success("Login successful");
    return true;
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Login failed: " + (err.response?.data?.message || "Invalid credentials"));
    return false;
  }
};

// Logout function
export const logoutAdmin = (): void => {
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('token');
  localStorage.removeItem('adminUsername');
  
  // Clear the JWT cookie
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Redirect to home
  window.location.href = "/";
};

// Get authenticated user's username
export const getAdminUsername = (): string => {
  return localStorage.getItem('adminUsername') || 'Admin';
};

// Verify authentication status with server
export const verifyAuthStatus = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      "https://urban-tokenization-survey.onrender.com/api/admin/users",
      {
        withCredentials: true,
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error("Auth verification failed:", error);
    // Clear invalid auth data
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('adminUsername');
    return false;
  }
};
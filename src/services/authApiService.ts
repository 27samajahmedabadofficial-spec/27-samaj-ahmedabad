/**
 * Auth API Service
 * Calls backend REST API for authentication instead of Supabase
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Get authorization headers
  getHeaders(includeAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Register user
  async register(email: string, password: string, fullName: string) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('authToken', data.data.token);
        this.token = data.data.token;
        return { success: true, data: data.data, error: null };
      } else {
        return { success: false, data: null, error: data };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        data: null,
        error: { message: 'Network error' },
      };
    }
  }

  // Login user
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('authToken', data.data.token);
        this.token = data.data.token;
        return { success: true, data: data.data, error: null };
      } else {
        return { success: false, data: null, error: data };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        data: null,
        error: { message: 'Network error' },
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data, error: null };
      } else {
        return { success: false, data: null, error: data };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        data: null,
        error: { message: 'Network error' },
      };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data, error: null };
      } else {
        return { success: false, data: null, error: data };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        data: null,
        error: { message: 'Network error' },
      };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    this.token = null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Set token manually (useful after refresh)
  setToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
      this.token = token;
    } else {
      localStorage.removeItem('authToken');
      this.token = null;
    }
  }
}

export const authApiService = new AuthApiService();

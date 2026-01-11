import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserProfile {
  id: string | number;
  mobile_no?: string;
  is_profile_complete?: boolean;
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (mobileNo: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (mobileNo: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Backend API configuration
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    // Check for existing token from previous login
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      // Create user object for backend API
      const mockUser = {
        id: userId,
        email: `user_${userId}@backend.local`,
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const signUp = async (mobileNo: string, password: string, fullName: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNo,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.message || "Registration failed") };
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        const userId = data.data.user?.id?.toString() || "";
        localStorage.setItem("userId", userId);
        
        // Create user object for backend API
        const mockUser = {
          id: userId,
          email: `user_${userId}@backend.local`,
        };
        setUser(mockUser);
        
        // Set profile
        setProfile(data.data.user as UserProfile);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (mobileNo: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNo, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.message || "Login failed") };
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        const userId = data.data.user?.id?.toString() || "";
        localStorage.setItem("userId", userId);
        
        // Create user object for backend API
        const mockUser = {
          id: userId,
          email: `user_${userId}@backend.local`,
        };
        setUser(mockUser);
        
        // Set profile
        setProfile(data.data.user as UserProfile);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

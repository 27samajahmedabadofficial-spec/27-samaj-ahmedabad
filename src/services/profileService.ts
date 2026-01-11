import axios from 'axios';
import type { UserProfile } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileService = {
  // Fetch user profile by ID
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Profile is already available from AuthContext
      // No need to make an extra API call
      return null;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  },

  // Update user profile (backend API)
  async updateProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>
  ): Promise<UserProfile | null> {
    try {
      const response = await apiClient.put(`/profile/update`, updates);
      if (response.data?.success) {
        return response.data.profile as UserProfile;
      }
      return null;
    } catch (err) {
      console.error("Error updating profile:", err);
      return null;
    }
  },

  // Update specific profile fields
  async updateProfileField(
    userId: string,
    field: keyof Omit<UserProfile, "id" | "created_at" | "updated_at">,
    value: string | null
  ): Promise<UserProfile | null> {
    return this.updateProfile(userId, { [field]: value });
  },

  // Check if profile exists (backend handles this)
  async profileExists(userId: string): Promise<boolean> {
    try {
      // Profile existence is checked on the backend
      return true;
    } catch {
      return false;
    }
  },

  // Create profile (backend handles post-signup)
  async createProfile(
    userId: string,
    fullName: string
  ): Promise<UserProfile | null> {
    try {
      // Profile is created automatically by backend during signup
      return null;
    } catch (err) {
      console.error("Error creating profile:", err);
      return null;
    }
  },
};

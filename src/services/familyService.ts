import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const familyService = {
  registerFamily: async (familyData, photoFile, receiptFile) => {
    try {
      const formData = new FormData();

      // Add family head details
      formData.append("fullName", familyData.fullName);
      formData.append("mobileNo", familyData.mobileNo);
      formData.append("villageName", familyData.villageName);
      formData.append("currentAddress", familyData.currentAddress);
      formData.append("dateOfBirth", familyData.dateOfBirth);
      formData.append("maritalStatus", familyData.maritalStatus);
      formData.append("jobBusinessDetails", familyData.jobBusinessDetails);
      formData.append("education", familyData.education);
      formData.append("paymentStatus", familyData.paymentStatus);

      // Add family members
      if (Array.isArray(familyData.familyMembers)) {
        formData.append("familyMembers", JSON.stringify(familyData.familyMembers));
      }

      // Add files
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      if (receiptFile) {
        formData.append("receipt", receiptFile);
      }

      const response = await apiClient.post("/family/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFamilyDetails: async () => {
    try {
      const response = await apiClient.get("/family/details");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateFamilyPaymentStatus: async (familyId, paymentStatus, receiptUrl) => {
    try {
      const response = await apiClient.put(`/family/status/${familyId}`, {
        paymentStatus,
        receiptUrl,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateFamily: async (familyData, photoFile, receiptFile) => {
    try {
      const formData = new FormData();

      // Add family head details
      formData.append("fullName", familyData.fullName);
      formData.append("mobileNo", familyData.mobileNo);
      formData.append("villageName", familyData.villageName);
      formData.append("currentAddress", familyData.currentAddress);
      formData.append("dateOfBirth", familyData.dateOfBirth);
      formData.append("maritalStatus", familyData.maritalStatus);
      formData.append("jobBusinessDetails", familyData.jobBusinessDetails);
      formData.append("education", familyData.education);
      
      if (familyData.paymentStatus) {
        formData.append("paymentStatus", familyData.paymentStatus);
      }

      // Add files if provided
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      if (receiptFile) {
        formData.append("receipt", receiptFile);
      }

      const response = await apiClient.put("/family/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addFamilyMember: async (memberData) => {
    try {
      const response = await apiClient.post("/family/members", memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateFamilyMember: async (memberId, memberData) => {
    try {
      const response = await apiClient.put(`/family/members/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteFamilyMember: async (memberId) => {
    try {
      const response = await apiClient.delete(`/family/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default apiClient;

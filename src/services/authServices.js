/**
 * ========================================
 * AUTH SERVICE
 * ========================================
 * Lokasi: src/services/authService.js
 *
 * Handle authentication:
 * - Login
 * - Logout
 * - Get current user
 * - Check if authenticated
 */

import api from "./api";

const authService = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User data & token
   */
  login: async (email, password) => {
    try {
      console.log("🔐 Attempting login...");
      console.log("   Email:", email);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Login successful!");
      console.log("   User:", response.user?.email);

      // Save to localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        console.log("✅ Token & user saved to localStorage");
      }

      return response;
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("✅ Token & user cleared from localStorage");
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User data or null
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  /**
   * Get token from localStorage
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;

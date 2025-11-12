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
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

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
    
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("fcm_token"); // Also clear FCM token
    
    console.log("✅ Token, user, and FCM token cleared from localStorage");
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

  /**
   * Send password reset email
   * @param {string} email - User email address
   * @returns {Promise<void>}
   */
  sendPasswordResetEmail: async (email) => {
    try {
      console.log("📧 Sending password reset email to:", email);

      // Optional: Configure action code settings
      const actionCodeSettings = {
        url: window.location.origin, // Redirect back to home after reset
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log("✅ Password reset email sent successfully!");
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);

      // User-friendly error messages
      let errorMessage = "Failed to send reset email. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      }

      throw new Error(errorMessage);
    }
  },
};

export default authService;

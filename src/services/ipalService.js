/**
 * ========================================
 * IPAL SERVICE
 * ========================================
 * API calls for IPAL management
 */

import api from "./api";

const ipalService = {
  /**
   * Get all IPALs
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (active|inactive|maintenance)
   * @param {number} params.limit - Limit results
   * @returns {Promise<Object>} Response with IPAL list
   */
  async getAllIpals(params = {}) {
    try {
      const response = await api.get("/api/ipals", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching IPALs:", error);
      throw error;
    }
  },

  /**
   * Get IPAL by ID
   * @param {number} ipalId - IPAL ID
   * @returns {Promise<Object>} IPAL details with sensor count and latest reading
   */
  async getIpalById(ipalId) {
    try {
      const response = await api.get(`/api/ipals/${ipalId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching IPAL ${ipalId}:`, error);
      throw error;
    }
  },

  /**
   * Get IPAL statistics
   * @param {number} ipalId - IPAL ID
   * @returns {Promise<Object>} IPAL statistics (sensors, alerts, readings count)
   */
  async getIpalStats(ipalId) {
    try {
      const response = await api.get(`/api/ipals/${ipalId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching IPAL stats ${ipalId}:`, error);
      throw error;
    }
  },
};

export default ipalService;

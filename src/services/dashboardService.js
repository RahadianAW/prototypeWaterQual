/**
 * ========================================
 * DASHBOARD SERVICE
 * ========================================
 * Lokasi: src/services/dashboardService.js
 *
 * Service untuk fetch data dashboard
 * - Summary IPAL (latest reading, statistics, alerts)
 * - Historical data untuk chart
 */

import api from "./api";

const dashboardService = {
  /**
   * Get dashboard summary untuk IPAL tertentu
   * @param {number} ipalId - IPAL ID (default: 1)
   * @returns {Promise<Object>} Dashboard data
   */
  getSummary: async (ipalId = 1) => {
    try {
      console.log(`📊 Fetching dashboard summary for IPAL ${ipalId}...`);

      const response = await api.get(`/api/dashboard/summary/${ipalId}`);

      console.log("✅ Dashboard summary fetched successfully");
      console.log(
        "   Latest reading:",
        response.data.latest_reading?.timestamp
      );
      console.log("   Active alerts:", response.data.active_alerts?.total || 0);

      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch dashboard summary:", error.message);
      throw error;
    }
  },

  /**
   * Get overview semua IPAL (optional - untuk future expansion)
   * @returns {Promise<Object>} Overview data
   */
  getOverview: async () => {
    try {
      console.log("📊 Fetching dashboard overview...");

      const response = await api.get("/api/dashboard/overview");

      console.log("✅ Dashboard overview fetched successfully");
      console.log(
        "   Total IPALs:",
        response.data.statistics?.total_ipals || 0
      );

      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch dashboard overview:", error.message);
      throw error;
    }
  },

  /**
   * Get historical readings untuk chart
   * @param {number} ipalId - IPAL ID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} Array of readings
   */
  getHistoricalData: async (ipalId = 1, options = {}) => {
    try {
      const {
        limit = 24, // Default: last 24 readings
        order = "desc", // desc = newest first
      } = options;

      console.log(`📈 Fetching historical data for IPAL ${ipalId}...`);
      console.log("   Options:", { limit, order });

      const response = await api.get(
        `/api/sensors/readings?ipal_id=${ipalId}&limit=${limit}&order=${order}`
      );

      console.log("✅ Historical data fetched successfully");
      console.log("   Total readings:", response.data?.length || 0);

      return response.data || [];
    } catch (error) {
      console.error("❌ Failed to fetch historical data:", error.message);
      throw error;
    }
  },

  /**
   * Get latest reading untuk IPAL tertentu
   * @param {number} ipalId - IPAL ID
   * @returns {Promise<Object>} Latest reading data
   */
  getLatestReading: async (ipalId = 1) => {
    try {
      console.log(`📊 Fetching latest reading for IPAL ${ipalId}...`);

      const response = await api.get(
        `/api/sensors/readings?ipal_id=${ipalId}&limit=1&order=desc`
      );

      if (response.data && response.data.length > 0) {
        console.log("✅ Latest reading fetched successfully");
        console.log("   Timestamp:", response.data[0].timestamp);
        return response.data[0];
      }

      console.log("⚠️  No readings found");
      return null;
    } catch (error) {
      console.error("❌ Failed to fetch latest reading:", error.message);
      throw error;
    }
  },

  /**
   * Get active alerts untuk IPAL tertentu
   * @param {number} ipalId - IPAL ID
   * @returns {Promise<Array>} Array of active alerts
   */
  getActiveAlerts: async (ipalId = 1) => {
    try {
      console.log(`🚨 Fetching active alerts for IPAL ${ipalId}...`);

      const response = await api.get(
        `/api/alerts?ipal_id=${ipalId}&status=active&limit=10`
      );

      console.log("✅ Active alerts fetched successfully");
      console.log("   Total alerts:", response.count || 0);

      return response.data || [];
    } catch (error) {
      console.error("❌ Failed to fetch active alerts:", error.message);
      throw error;
    }
  },

  /**
   * Get statistics summary
   * @param {number} ipalId - IPAL ID
   * @returns {Promise<Object>} Statistics data
   */
  getStatistics: async (ipalId = 1) => {
    try {
      console.log(`📊 Fetching statistics for IPAL ${ipalId}...`);

      // Get dari summary endpoint (sudah include statistics)
      const summary = await dashboardService.getSummary(ipalId);

      return summary.statistics || null;
    } catch (error) {
      console.error("❌ Failed to fetch statistics:", error.message);
      throw error;
    }
  },
};

export default dashboardService;

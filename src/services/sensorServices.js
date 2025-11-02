/**
 * ========================================
 * SENSOR SERVICE
 * ========================================
 * Lokasi: src/services/sensorService.js
 *
 * Service untuk fetch sensor readings data
 * - Get readings (dengan filter)
 * - Get latest reading
 */

import api from "./api";

const sensorService = {
  /**
   * Get sensor readings dengan filter
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of readings
   */
  getReadings: async (filters = {}) => {
    try {
      const {
        ipal_id = 1,
        limit = 50,
        order = "desc", // asc or desc
        start_date = null,
        end_date = null,
      } = filters;

      console.log("📊 Fetching sensor readings...");
      console.log("   Filters:", { ipal_id, limit, order });

      // Build query string
      let queryParams = `ipal_id=${ipal_id}&limit=${limit}&order=${order}`;

      if (start_date) {
        queryParams += `&start_date=${start_date}`;
      }

      if (end_date) {
        queryParams += `&end_date=${end_date}`;
      }

      const response = await api.get(`/api/sensors/readings?${queryParams}`);

      console.log("✅ Sensor readings fetched successfully");
      console.log("   Total readings:", response.data?.length || 0);

      return response.data || [];
    } catch (error) {
      console.error("❌ Failed to fetch sensor readings:", error.message);
      throw error;
    }
  },

  /**
   * Get latest reading untuk IPAL tertentu
   * @param {number} ipalId - IPAL ID
   * @returns {Promise<Object|null>} Latest reading atau null
   */
  getLatestReading: async (ipalId = 1) => {
    try {
      console.log(`📊 Fetching latest reading for IPAL ${ipalId}...`);

      const readings = await sensorService.getReadings({
        ipal_id: ipalId,
        limit: 1,
        order: "desc",
      });

      if (readings && readings.length > 0) {
        console.log("✅ Latest reading found");
        return readings[0];
      }

      console.log("⚠️  No readings found");
      return null;
    } catch (error) {
      console.error("❌ Failed to fetch latest reading:", error.message);
      throw error;
    }
  },

  /**
   * Create new sensor reading (dari ESP32/Arduino)
   * @param {Object} data - Reading data
   * @returns {Promise<Object>} Response
   */
  createReading: async (data) => {
    try {
      console.log("📤 Creating new sensor reading...");

      const response = await api.post("/api/sensors/readings", data);

      console.log("✅ Sensor reading created successfully");
      console.log("   Reading ID:", response.data?.reading_id);

      return response;
    } catch (error) {
      console.error("❌ Failed to create sensor reading:", error.message);
      throw error;
    }
  },
};

export default sensorService;

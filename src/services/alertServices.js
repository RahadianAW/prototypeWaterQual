/**
 * ========================================
 * ALERT SERVICE
 * ========================================
 * API calls for alert management
 */

import api from "./api";

const ALERT_ENDPOINTS = {
  BASE: "/api/alerts",
  STATS: "/api/alerts/stats",
  BY_ID: (id) => `/api/alerts/${id}`,
  READ: (id) => `/api/alerts/${id}/read`,
  STATUS: (id) => `/api/alerts/${id}/status`,
  DELETE: (id) => `/api/alerts/${id}`,
};

/**
 * Get all alerts with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Response with alerts array
 */
export const getAlerts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    // Add filters to query params
    if (filters.ipal_id) params.append("ipal_id", filters.ipal_id);
    if (filters.status) params.append("status", filters.status);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.parameter) params.append("parameter", filters.parameter);
    if (filters.location) params.append("location", filters.location);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.start_after) params.append("start_after", filters.start_after);

    const queryString = params.toString();
    const url = queryString
      ? `${ALERT_ENDPOINTS.BASE}?${queryString}`
      : ALERT_ENDPOINTS.BASE;

    const response = await api.get(url);
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

/**
 * Get alert statistics
 * @param {Number} ipal_id - IPAL ID (optional)
 * @returns {Promise<Object>} Alert statistics
 */
export const getAlertStats = async (ipal_id = null) => {
  try {
    const url = ipal_id
      ? `${ALERT_ENDPOINTS.STATS}?ipal_id=${ipal_id}`
      : ALERT_ENDPOINTS.STATS;

    const response = await api.get(url);
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error("Error fetching alert stats:", error);
    throw error;
  }
};

/**
 * Get alert by ID
 * @param {String} id - Alert ID
 * @returns {Promise<Object>} Alert data
 */
export const getAlertById = async (id) => {
  try {
    const response = await api.get(ALERT_ENDPOINTS.BY_ID(id));
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error(`Error fetching alert ${id}:`, error);
    throw error;
  }
};

/**
 * Mark alert as read
 * @param {String} id - Alert ID
 * @returns {Promise<Object>} Update result
 */
export const markAlertAsRead = async (id) => {
  try {
    const response = await api.put(ALERT_ENDPOINTS.READ(id));
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error(`Error marking alert ${id} as read:`, error);
    throw error;
  }
};

/**
 * Acknowledge alert (status: acknowledged)
 * @param {String} id - Alert ID
 * @returns {Promise<Object>} Update result
 */
export const acknowledgeAlert = async (id) => {
  try {
    const response = await api.put(ALERT_ENDPOINTS.STATUS(id), {
      status: "acknowledged",
    });
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error(`Error acknowledging alert ${id}:`, error);
    throw error;
  }
};

/**
 * Resolve alert (status: resolved)
 * @param {String} id - Alert ID
 * @returns {Promise<Object>} Update result
 */
export const resolveAlert = async (id) => {
  try {
    const response = await api.put(ALERT_ENDPOINTS.STATUS(id), {
      status: "resolved",
    });
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error(`Error resolving alert ${id}:`, error);
    throw error;
  }
};

/**
 * Delete alert (admin only)
 * @param {String} id - Alert ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteAlert = async (id) => {
  try {
    const response = await api.delete(ALERT_ENDPOINTS.DELETE(id));
    return response; // ✅ FIXED: Remove .data
  } catch (error) {
    console.error(`Error deleting alert ${id}:`, error);
    throw error;
  }
};

/**
 * Get active alerts count (for badge)
 * @param {Number} ipal_id - IPAL ID
 * @returns {Promise<Number>} Active alert count
 */
export const getActiveAlertCount = async (ipal_id = 1) => {
  try {
    const response = await getAlerts({
      ipal_id,
      status: "active",
      limit: 100,
    });
    return response.count || 0;
  } catch (error) {
    console.error("Error fetching active alert count:", error);
    return 0;
  }
};

export default {
  getAlerts,
  getAlertStats,
  getAlertById,
  markAlertAsRead,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert,
  getActiveAlertCount,
};

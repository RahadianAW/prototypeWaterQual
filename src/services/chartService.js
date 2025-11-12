/**
 * ========================================
 * CHART SERVICE (FRONTEND)
 * ========================================
 * API service for fetching chart data
 *
 * OPTIMIZATIONS:
 * ✅ Request deduplication
 * ✅ In-flight request cache
 * ✅ Error handling
 */

import api from "./api"; // Your existing axios instance

// ========================================
// IN-FLIGHT REQUEST CACHE
// ========================================

const inFlightRequests = new Map();

function deduplicateRequest(key, requestFn) {
  if (inFlightRequests.has(key)) {
    console.log(`♻️  Reusing in-flight chart request: ${key}`);
    return inFlightRequests.get(key);
  }

  const promise = requestFn().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, promise);
  return promise;
}

// ========================================
// CHART API CALLS
// ========================================

/**
 * Get multi-parameter time-series chart
 * @param {number} ipalId - IPAL ID
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 * @param {Array<string>} parameters - Parameters to include
 */
export async function getTimeSeriesChart(
  ipalId,
  timeRange = "7d",
  parameters = null
) {
  const key = `chart-timeseries-${ipalId}-${timeRange}-${parameters?.join(
    ","
  )}`;

  return deduplicateRequest(key, async () => {
    const params = { time_range: timeRange };
    if (parameters && parameters.length > 0) {
      params.parameters = parameters.join(",");
    }

    const response = await api.get(`/api/charts/timeseries/${ipalId}`, {
      params,
    });
    return response.data;
  });
}

/**
 * Get parameter comparison chart (inlet vs outlet)
 * @param {number} ipalId - IPAL ID
 * @param {string} parameter - Parameter name
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 */
export async function getComparisonChart(ipalId, parameter, timeRange = "7d") {
  const key = `chart-comparison-${ipalId}-${parameter}-${timeRange}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(
      `/api/charts/comparison/${ipalId}/${parameter}`,
      {
        params: { time_range: timeRange },
      }
    );
    return response.data;
  });
}

/**
 * Get quality score chart
 * @param {number} ipalId - IPAL ID
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 */
export async function getQualityScoreChart(ipalId, timeRange = "7d") {
  const key = `chart-quality-${ipalId}-${timeRange}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/charts/quality-score/${ipalId}`, {
      params: { time_range: timeRange },
    });
    return response.data;
  });
}

/**
 * Get bar chart (inlet vs outlet comparison)
 * @param {number} ipalId - IPAL ID
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 */
export async function getBarChart(ipalId, timeRange = "7d") {
  const key = `chart-bar-${ipalId}-${timeRange}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/charts/bar/${ipalId}`, {
      params: { time_range: timeRange },
    });
    return response.data;
  });
}

/**
 * Get sensor-specific chart
 * @param {string} sensorId - Sensor ID
 * @param {number} ipalId - IPAL ID
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 */
export async function getSensorChart(sensorId, ipalId, timeRange = "7d") {
  const key = `chart-sensor-${sensorId}-${timeRange}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/charts/sensor/${sensorId}`, {
      params: { ipal_id: ipalId, time_range: timeRange },
    });
    return response.data;
  });
}

/**
 * Get complete dashboard chart data
 * Returns time-series, quality score, and bar chart in one request
 * @param {number} ipalId - IPAL ID
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 */
export async function getDashboardChart(ipalId, timeRange = "7d") {
  const key = `chart-dashboard-${ipalId}-${timeRange}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/charts/dashboard/${ipalId}`, {
      params: { time_range: timeRange },
    });
    return response.data;
  });
}

// ========================================
// CACHE MANAGEMENT (Admin functions)
// ========================================

/**
 * Clear backend chart cache (requires admin auth)
 */
export async function clearBackendCache() {
  try {
    const response = await api.post("/api/charts/cache/clear");
    return response.data;
  } catch (error) {
    console.error("Failed to clear backend cache:", error);
    throw error;
  }
}

/**
 * Get backend cache statistics (requires admin auth)
 */
export async function getCacheStats() {
  try {
    const response = await api.get("/api/charts/cache/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to get cache stats:", error);
    throw error;
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clear in-flight request cache
 */
export function clearInFlightRequests() {
  inFlightRequests.clear();
  console.log("🧹 Cleared in-flight chart requests cache");
}

/**
 * Get in-flight request status (for debugging)
 */
export function getInFlightRequestsStatus() {
  return {
    count: inFlightRequests.size,
    keys: Array.from(inFlightRequests.keys()),
  };
}

export default {
  // Chart fetchers
  getTimeSeriesChart,
  getComparisonChart,
  getQualityScoreChart,
  getBarChart,
  getSensorChart,
  getDashboardChart,

  // Cache management
  clearBackendCache,
  getCacheStats,
  clearInFlightRequests,
  getInFlightRequestsStatus,
};

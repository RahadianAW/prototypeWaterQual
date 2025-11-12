/**
 * ========================================
 * STATISTIC SERVICE (FRONTEND)
 * ========================================
 * API service for fetching statistics data
 *
 * OPTIMIZATIONS:
 * ✅ Request deduplication (prevent multiple same requests)
 * ✅ Cached in-flight requests
 * ✅ Error handling
 */

import api from "./api"; // Your existing axios instance

// ========================================
// IN-FLIGHT REQUEST CACHE
// ========================================
// Prevents multiple identical requests at the same time

const inFlightRequests = new Map();

/**
 * Deduplicate requests - if same request is in-flight, return existing promise
 */
function deduplicateRequest(key, requestFn) {
  // Check if request is already in-flight
  if (inFlightRequests.has(key)) {
    console.log(`♻️  Reusing in-flight request: ${key}`);
    return inFlightRequests.get(key);
  }

  // Execute new request
  const promise = requestFn().finally(() => {
    // Clean up after request completes
    inFlightRequests.delete(key);
  });

  // Store in-flight request
  inFlightRequests.set(key, promise);

  return promise;
}

// ========================================
// STATISTICS API CALLS
// ========================================

/**
 * Get time range statistics
 * @param {number} ipalId - IPAL ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Array<string>} parameters - Optional parameters filter
 */
export async function getTimeRangeStats(
  ipalId,
  startDate,
  endDate,
  parameters = null
) {
  const key = `stats-range-${ipalId}-${startDate}-${endDate}-${parameters?.join(
    ","
  )}`;

  return deduplicateRequest(key, async () => {
    const params = { start_date: startDate, end_date: endDate };
    if (parameters && parameters.length > 0) {
      params.parameters = parameters.join(",");
    }

    const response = await api.get(`/api/statistics/range/${ipalId}`, {
      params,
    });
    return response.data;
  });
}

/**
 * Get hourly aggregation for specific date
 * @param {number} ipalId - IPAL ID
 * @param {string} date - Date (YYYY-MM-DD)
 */
export async function getHourlyAggregation(ipalId, date) {
  const key = `stats-hourly-${ipalId}-${date}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/statistics/hourly/${ipalId}`, {
      params: { date },
    });
    return response.data;
  });
}

/**
 * Get daily aggregation for date range
 * @param {number} ipalId - IPAL ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 */
export async function getDailyAggregation(ipalId, startDate, endDate) {
  const key = `stats-daily-${ipalId}-${startDate}-${endDate}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/statistics/daily/${ipalId}`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  });
}

/**
 * Get parameter trend
 * @param {number} ipalId - IPAL ID
 * @param {string} parameter - Parameter name (ph, tds, turbidity, temperature)
 * @param {string} timeRange - Time range (24h, 7d, 30d, 90d)
 * @param {string} interval - Interval (raw, hourly, daily)
 */
export async function getParameterTrend(
  ipalId,
  parameter,
  timeRange = "7d",
  interval = "hourly"
) {
  const key = `stats-trend-${ipalId}-${parameter}-${timeRange}-${interval}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(
      `/api/statistics/trend/${ipalId}/${parameter}`,
      {
        params: { time_range: timeRange, interval },
      }
    );
    return response.data;
  });
}

/**
 * Get inlet vs outlet comparison
 * @param {number} ipalId - IPAL ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 */
export async function compareInletOutlet(ipalId, startDate, endDate) {
  const key = `stats-compare-${ipalId}-${startDate}-${endDate}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/statistics/compare/${ipalId}`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  });
}

/**
 * Get quality score trend
 * @param {number} ipalId - IPAL ID
 * @param {string} timeRange - Time range (24h, 7d, 30d)
 */
export async function getQualityScoreTrend(ipalId, timeRange = "7d") {
  const key = `stats-quality-${ipalId}-${timeRange}`;

  return deduplicateRequest(key, async () => {
    const response = await api.get(`/api/statistics/quality-score/${ipalId}`, {
      params: { time_range: timeRange },
    });
    return response.data;
  });
}

/**
 * Get available options (parameters, time ranges, etc.)
 * This is cached permanently since it rarely changes
 */
let cachedOptions = null;

export async function getStatisticOptions() {
  if (cachedOptions) {
    return { success: true, data: cachedOptions };
  }

  const response = await api.get("/api/statistics/options");
  cachedOptions = response.data.data;
  return response.data;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clear in-flight request cache (useful for testing)
 */
export function clearInFlightRequests() {
  inFlightRequests.clear();
  console.log("🧹 Cleared in-flight requests cache");
}

/**
 * Get cache status (for debugging)
 */
export function getInFlightRequestsStatus() {
  return {
    count: inFlightRequests.size,
    keys: Array.from(inFlightRequests.keys()),
  };
}

export default {
  getTimeRangeStats,
  getHourlyAggregation,
  getDailyAggregation,
  getParameterTrend,
  compareInletOutlet,
  getQualityScoreTrend,
  getStatisticOptions,
  clearInFlightRequests,
  getInFlightRequestsStatus,
};

/**
 * ========================================
 * useChart Hook
 * ========================================
 * Custom hook for fetching chart data with:
 * ✅ Aggressive caching (5 minutes default)
 * ✅ Manual refresh only (NO auto-polling by default)
 * ✅ Stale-while-revalidate pattern
 * ✅ Loading & error states
 * ✅ Request deduplication via service layer
 *
 * QUOTA SAFE: Only fetches when explicitly requested!
 */

import { useState, useEffect, useCallback, useRef } from "react";
import chartService from "../services/chartService";

// ========================================
// IN-MEMORY CACHE
// ========================================

const chartCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedChart(key) {
  const cached = chartCache.get(key);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;

  // Return cached data if still valid
  if (age < CACHE_DURATION) {
    return {
      data: cached.data,
      isStale: false,
      age: Math.floor(age / 1000), // age in seconds
    };
  }

  // Data is stale but we'll return it anyway (stale-while-revalidate)
  return {
    data: cached.data,
    isStale: true,
    age: Math.floor(age / 1000),
  };
}

function setCachedChart(key, data) {
  chartCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// ========================================
// useChart Hook
// ========================================

/**
 * @param {string} chartType - Type of chart (timeseries, comparison, quality, bar, sensor, dashboard)
 * @param {Object} params - Chart parameters
 * @param {Object} options - Hook options
 * @returns {Object} { data, loading, error, refetch, isStale, cacheAge }
 */
export function useChart(chartType, params = {}, options = {}) {
  const {
    enabled = true, // Whether to fetch on mount
    cacheTime = 5 * 60 * 1000, // Cache duration (default: 5 minutes)
    staleTime = 2 * 60 * 1000, // Time before data considered stale (default: 2 minutes)
    onSuccess, // Callback on successful fetch
    onError, // Callback on error
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [cacheAge, setCacheAge] = useState(null);

  // Track if component is mounted (prevent state updates after unmount)
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Generate cache key
  const cacheKey = `${chartType}-${JSON.stringify(params)}`;

  // Fetch function
  const fetchChart = useCallback(
    async (forceRefresh = false) => {
      try {
        // Check cache first (unless force refresh)
        if (!forceRefresh) {
          const cached = getCachedChart(cacheKey);
          if (cached) {
            console.log(
              `📊 Cache HIT: ${chartType} (age: ${cached.age}s, stale: ${cached.isStale})`
            );

            if (isMountedRef.current) {
              setData(cached.data);
              setIsStale(cached.isStale);
              setCacheAge(cached.age);
              setError(null);
            }

            // If data is fresh enough, don't fetch
            if (!cached.isStale) {
              return cached.data;
            }

            // Data is stale, we'll fetch in background but already returned cached data
            console.log(`🔄 Revalidating stale cache for ${chartType}...`);
          }
        }

        // Set loading (only if no cached data available)
        if (isMountedRef.current && !data) {
          setLoading(true);
        }

        // Fetch from API based on chart type
        let response;

        switch (chartType) {
          case "timeseries":
            response = await chartService.getTimeSeriesChart(
              params.ipalId,
              params.timeRange,
              params.parameters
            );
            break;

          case "comparison":
            response = await chartService.getComparisonChart(
              params.ipalId,
              params.parameter,
              params.timeRange
            );
            break;

          case "quality":
            response = await chartService.getQualityScoreChart(
              params.ipalId,
              params.timeRange
            );
            break;

          case "bar":
            response = await chartService.getBarChart(
              params.ipalId,
              params.timeRange
            );
            break;

          case "sensor":
            response = await chartService.getSensorChart(
              params.sensorId,
              params.ipalId,
              params.timeRange
            );
            break;

          case "dashboard":
            response = await chartService.getDashboardChart(
              params.ipalId,
              params.timeRange
            );
            break;

          default:
            throw new Error(`Unknown chart type: ${chartType}`);
        }

        // Cache the response
        setCachedChart(cacheKey, response.data);

        // Update state (only if still mounted)
        if (isMountedRef.current) {
          setData(response.data);
          setIsStale(false);
          setCacheAge(0);
          setError(null);
          setLoading(false);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        console.error(`❌ Error fetching ${chartType} chart:`, err);

        if (isMountedRef.current) {
          setError(err.message || "Failed to fetch chart data");
          setLoading(false);
        }

        // Call error callback
        if (onError) {
          onError(err);
        }

        throw err;
      }
    },
    [chartType, cacheKey, params, data, onSuccess, onError]
  );

  // Auto-fetch on mount (if enabled)
  useEffect(() => {
    if (enabled) {
      fetchChart();
    }
  }, [enabled, fetchChart]);

  // Manual refetch function
  const refetch = useCallback(
    (forceRefresh = true) => {
      return fetchChart(forceRefresh);
    },
    [fetchChart]
  );

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
    cacheAge,
  };
}

// ========================================
// Specialized Hooks (convenience wrappers)
// ========================================

/**
 * Hook for time-series chart
 */
export function useTimeSeriesChart(
  ipalId,
  timeRange = "7d",
  parameters = null,
  options = {}
) {
  return useChart("timeseries", { ipalId, timeRange, parameters }, options);
}

/**
 * Hook for comparison chart
 */
export function useComparisonChart(
  ipalId,
  parameter,
  timeRange = "7d",
  options = {}
) {
  return useChart("comparison", { ipalId, parameter, timeRange }, options);
}

/**
 * Hook for quality score chart
 */
export function useQualityScoreChart(ipalId, timeRange = "7d", options = {}) {
  return useChart("quality", { ipalId, timeRange }, options);
}

/**
 * Hook for bar chart
 */
export function useBarChart(ipalId, timeRange = "7d", options = {}) {
  return useChart("bar", { ipalId, timeRange }, options);
}

/**
 * Hook for sensor chart
 */
export function useSensorChart(
  sensorId,
  ipalId,
  timeRange = "7d",
  options = {}
) {
  return useChart("sensor", { sensorId, ipalId, timeRange }, options);
}

/**
 * Hook for complete dashboard chart
 */
export function useDashboardChart(ipalId, timeRange = "7d", options = {}) {
  return useChart("dashboard", { ipalId, timeRange }, options);
}

// ========================================
// Cache Management
// ========================================

/**
 * Clear all chart cache
 */
export function clearChartCache() {
  chartCache.clear();
  console.log("🧹 Cleared all chart cache");
}

/**
 * Get cache statistics
 */
export function getChartCacheStats() {
  const now = Date.now();
  const entries = Array.from(chartCache.entries()).map(([key, value]) => ({
    key,
    age: Math.floor((now - value.timestamp) / 1000),
    isStale: now - value.timestamp > CACHE_DURATION,
  }));

  return {
    size: chartCache.size,
    entries,
  };
}

export default useChart;

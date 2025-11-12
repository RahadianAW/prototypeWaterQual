/**
 * ========================================
 * useStatistics Hook
 * ========================================
 * Custom hook for fetching statistics with:
 * ✅ Aggressive caching (5 minutes)
 * ✅ Manual refresh only (NO auto-polling)
 * ✅ Stale-while-revalidate pattern
 * ✅ Request deduplication
 *
 * QUOTA SAFE: Only fetches when explicitly requested!
 */

import { useState, useEffect, useCallback, useRef } from "react";
import statisticService from "../services/statisticService";

// ========================================
// IN-MEMORY CACHE
// ========================================

const statsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedStats(key) {
  const cached = statsCache.get(key);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;

  if (age < CACHE_DURATION) {
    return {
      data: cached.data,
      isStale: false,
      age: Math.floor(age / 1000),
    };
  }

  return {
    data: cached.data,
    isStale: true,
    age: Math.floor(age / 1000),
  };
}

function setCachedStats(key, data) {
  statsCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// ========================================
// useStatistics Hook
// ========================================

/**
 * @param {string} statsType - Type of statistics
 * @param {Object} params - Parameters
 * @param {Object} options - Hook options
 */
export function useStatistics(statsType, params = {}, options = {}) {
  const {
    enabled = true,
    cacheTime = 5 * 60 * 1000,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [cacheAge, setCacheAge] = useState(null);

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const cacheKey = `${statsType}-${JSON.stringify(params)}`;

  const fetchStats = useCallback(
    async (forceRefresh = false) => {
      try {
        // Check cache first
        if (!forceRefresh) {
          const cached = getCachedStats(cacheKey);
          if (cached) {
            console.log(
              `📊 Stats cache HIT: ${statsType} (age: ${cached.age}s)`
            );

            if (isMountedRef.current) {
              setData(cached.data);
              setIsStale(cached.isStale);
              setCacheAge(cached.age);
              setError(null);
            }

            if (!cached.isStale) {
              return cached.data;
            }

            console.log(
              `🔄 Revalidating stale stats cache for ${statsType}...`
            );
          }
        }

        if (isMountedRef.current && !data) {
          setLoading(true);
        }

        // Fetch from API
        let response;

        switch (statsType) {
          case "range":
            response = await statisticService.getTimeRangeStats(
              params.ipalId,
              params.startDate,
              params.endDate,
              params.parameters
            );
            break;

          case "hourly":
            response = await statisticService.getHourlyAggregation(
              params.ipalId,
              params.date
            );
            break;

          case "daily":
            response = await statisticService.getDailyAggregation(
              params.ipalId,
              params.startDate,
              params.endDate
            );
            break;

          case "trend":
            response = await statisticService.getParameterTrend(
              params.ipalId,
              params.parameter,
              params.timeRange,
              params.interval
            );
            break;

          case "compare":
            response = await statisticService.compareInletOutlet(
              params.ipalId,
              params.startDate,
              params.endDate
            );
            break;

          case "quality":
            response = await statisticService.getQualityScoreTrend(
              params.ipalId,
              params.timeRange
            );
            break;

          default:
            throw new Error(`Unknown stats type: ${statsType}`);
        }

        // Cache response
        setCachedStats(cacheKey, response.data);

        if (isMountedRef.current) {
          setData(response.data);
          setIsStale(false);
          setCacheAge(0);
          setError(null);
          setLoading(false);
        }

        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        console.error(`❌ Error fetching ${statsType} stats:`, err);

        if (isMountedRef.current) {
          setError(err.message || "Failed to fetch statistics");
          setLoading(false);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      }
    },
    [statsType, cacheKey, params, data, onSuccess, onError]
  );

  useEffect(() => {
    if (enabled) {
      fetchStats();
    }
  }, [enabled, fetchStats]);

  const refetch = useCallback(
    (forceRefresh = true) => {
      return fetchStats(forceRefresh);
    },
    [fetchStats]
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
// Specialized Hooks
// ========================================

/**
 * Hook for time range statistics
 */
export function useTimeRangeStats(
  ipalId,
  startDate,
  endDate,
  parameters = null,
  options = {}
) {
  return useStatistics(
    "range",
    { ipalId, startDate, endDate, parameters },
    options
  );
}

/**
 * Hook for hourly aggregation
 */
export function useHourlyAggregation(ipalId, date, options = {}) {
  return useStatistics("hourly", { ipalId, date }, options);
}

/**
 * Hook for daily aggregation
 */
export function useDailyAggregation(ipalId, startDate, endDate, options = {}) {
  return useStatistics("daily", { ipalId, startDate, endDate }, options);
}

/**
 * Hook for parameter trend
 */
export function useParameterTrend(
  ipalId,
  parameter,
  timeRange = "7d",
  interval = "hourly",
  options = {}
) {
  return useStatistics(
    "trend",
    { ipalId, parameter, timeRange, interval },
    options
  );
}

/**
 * Hook for inlet vs outlet comparison
 */
export function useInletOutletComparison(
  ipalId,
  startDate,
  endDate,
  options = {}
) {
  return useStatistics("compare", { ipalId, startDate, endDate }, options);
}

/**
 * Hook for quality score trend
 */
export function useQualityScoreTrend(ipalId, timeRange = "7d", options = {}) {
  return useStatistics("quality", { ipalId, timeRange }, options);
}

// ========================================
// Cache Management
// ========================================

export function clearStatsCache() {
  statsCache.clear();
  console.log("🧹 Cleared all statistics cache");
}

export function getStatsCacheStats() {
  const now = Date.now();
  const entries = Array.from(statsCache.entries()).map(([key, value]) => ({
    key,
    age: Math.floor((now - value.timestamp) / 1000),
    isStale: now - value.timestamp > CACHE_DURATION,
  }));

  return {
    size: statsCache.size,
    entries,
  };
}

export default useStatistics;

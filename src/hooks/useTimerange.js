/**
 * ========================================
 * useTimeRange Hook
 * ========================================
 * Manages time range selection with:
 * ✅ LocalStorage persistence
 * ✅ Date calculations
 * ✅ Quick presets (24h, 7d, 30d, etc.)
 */

import { useState, useEffect, useCallback } from "react";

// ========================================
// TIME RANGE PRESETS
// ========================================

export const TIME_RANGES = {
  "24h": { label: "Last 24 Hours", hours: 24 },
  "7d": { label: "Last 7 Days", days: 7 },
  "30d": { label: "Last 30 Days", days: 30 },
  "90d": { label: "Last 90 Days", days: 90 },
  custom: { label: "Custom Range", custom: true },
};

// ========================================
// DATE UTILITIES
// ========================================

/**
 * Calculate start and end dates for a time range preset
 */
function calculateDatesForPreset(preset) {
  const end = new Date();
  const start = new Date();

  const config = TIME_RANGES[preset];

  if (!config) {
    throw new Error(`Invalid preset: ${preset}`);
  }

  if (config.hours) {
    start.setHours(start.getHours() - config.hours);
  } else if (config.days) {
    start.setDate(start.getDate() - config.days);
  }

  return {
    startDate: start.toISOString().split("T")[0], // YYYY-MM-DD
    endDate: end.toISOString().split("T")[0],
  };
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  return date.toISOString().split("T")[0];
}

// ========================================
// useTimeRange Hook
// ========================================

/**
 * @param {string} defaultPreset - Default time range preset (e.g., '7d')
 * @param {Object} options - Hook options
 */
export function useTimeRange(defaultPreset = "7d", options = {}) {
  const {
    storageKey = "timeRange", // LocalStorage key for persistence
    persist = true, // Whether to persist selection
  } = options;

  // Load initial value from localStorage (if persist enabled)
  const getInitialState = () => {
    if (persist && typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn("Failed to parse stored time range:", e);
        }
      }
    }

    // Default state
    const dates = calculateDatesForPreset(defaultPreset);
    return {
      preset: defaultPreset,
      startDate: dates.startDate,
      endDate: dates.endDate,
    };
  };

  const [timeRange, setTimeRange] = useState(getInitialState);

  // Persist to localStorage whenever it changes
  useEffect(() => {
    if (persist && typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(timeRange));
    }
  }, [timeRange, persist, storageKey]);

  // Set preset (24h, 7d, 30d, etc.)
  const setPreset = useCallback((preset) => {
    if (preset === "custom") {
      // For custom, keep existing dates
      setTimeRange((prev) => ({
        ...prev,
        preset: "custom",
      }));
    } else {
      const dates = calculateDatesForPreset(preset);
      setTimeRange({
        preset,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
    }
  }, []);

  // Set custom date range
  const setCustomRange = useCallback((startDate, endDate) => {
    setTimeRange({
      preset: "custom",
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
  }, []);

  // Set start date only (keep preset as custom)
  const setStartDate = useCallback((date) => {
    setTimeRange((prev) => ({
      ...prev,
      preset: "custom",
      startDate: formatDate(date),
    }));
  }, []);

  // Set end date only (keep preset as custom)
  const setEndDate = useCallback((date) => {
    setTimeRange((prev) => ({
      ...prev,
      preset: "custom",
      endDate: formatDate(date),
    }));
  }, []);

  // Reset to default
  const reset = useCallback(() => {
    const dates = calculateDatesForPreset(defaultPreset);
    setTimeRange({
      preset: defaultPreset,
      startDate: dates.startDate,
      endDate: dates.endDate,
    });
  }, [defaultPreset]);

  // Check if current selection is a preset (not custom)
  const isPreset = timeRange.preset !== "custom";

  // Get label for current selection
  const label = TIME_RANGES[timeRange.preset]?.label || "Custom Range";

  return {
    // Current state
    preset: timeRange.preset,
    startDate: timeRange.startDate,
    endDate: timeRange.endDate,
    label,
    isPreset,

    // Setters
    setPreset,
    setCustomRange,
    setStartDate,
    setEndDate,
    reset,

    // Utilities
    TIME_RANGES,
  };
}

// ========================================
// Specialized Hooks
// ========================================

/**
 * Hook for chart time range (typically uses presets only)
 */
export function useChartTimeRange(defaultPreset = "7d") {
  return useTimeRange(defaultPreset, {
    storageKey: "chartTimeRange",
    persist: true,
  });
}

/**
 * Hook for report date range (supports custom dates)
 */
export function useReportDateRange() {
  return useTimeRange("30d", {
    storageKey: "reportDateRange",
    persist: true,
  });
}

export default useTimeRange;

/**
 * ========================================
 * USE ALERT POLLING HOOK (FIXED)
 * ========================================
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getAlerts, getAlertStats } from "../services/alertServices";

export const useAlertPolling = (options = {}) => {
  const {
    ipal_id = 1,
    status = null, // ← CHANGE: null = get all (don't send status param)
    interval = 15000,
    autoStart = false,
    limit = 200,
  } = options;

  // State
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isPolling, setIsPolling] = useState(false); // ← CHANGE: Start false

  // Refs
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);

      const filters = {
        ipal_id,
        limit,
      };

      if (status && status !== "all") {
        filters.status = status;
      }

      console.log("🔍 Fetching with filters:", filters); // ← ADD

      // Fetch alerts
      const alertsResponse = await getAlerts(filters);

      console.log("📦 Full alertsResponse:", alertsResponse); // ← ADD
      console.log("📦 alertsResponse.data:", alertsResponse.data); // ← ADD
      console.log("📦 alertsResponse.count:", alertsResponse.count); // ← ADD

      // Fetch stats
      const statsResponse = await getAlertStats(ipal_id);

      console.log("📊 Full statsResponse:", statsResponse); // ← ADD

      // Update state
      if (isMountedRef.current) {
        setAlerts(alertsResponse.data || []);
        setStats(statsResponse.data || null);
        setLastUpdate(new Date());
        setLoading(false);
      }

      console.log(`✅ Alerts fetched: ${alertsResponse.count || 0} alerts`);
    } catch (err) {
      console.error("❌ Error fetching alerts:", err);
      if (isMountedRef.current) {
        setError(err.message || "Failed to fetch alerts");
        setLoading(false);
      }
    }
  }, [ipal_id, status, limit]);

  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    if (isPolling) return; // ← PREVENT double start

    console.log("🔄 Starting alert polling...");
    setIsPolling(true);

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch
    fetchAlerts();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchAlerts();
    }, interval);
  }, [fetchAlerts, interval, isPolling]); // ← ADD isPolling to deps

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    console.log("⏸️ Stopping alert polling...");
    setIsPolling(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Manual refresh
   */
  const refresh = useCallback(() => {
    console.log("🔃 Manual refresh triggered");
    setLoading(true);
    fetchAlerts();
  }, [fetchAlerts]);

  /**
   * Setup polling on mount
   */
  useEffect(() => {
    isMountedRef.current = true;

    if (autoStart) {
      startPolling();
    }

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up alert polling...");
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // ← ONLY run on mount/unmount

  return {
    // Data
    alerts,
    stats,
    loading,
    error,
    lastUpdate,

    // State
    isPolling,

    // Controls
    startPolling,
    stopPolling,
    refresh,

    // Computed
    activeCount: stats?.by_status?.active || 0,
    totalCount: stats?.total || 0,
  };
};

export default useAlertPolling;

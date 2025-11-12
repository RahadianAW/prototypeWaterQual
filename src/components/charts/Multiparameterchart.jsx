/**
 * ========================================
 * MultiParameterChart Component
 * ========================================
 * Multi-line chart showing multiple parameters (pH, TDS, turbidity, temp)
 * Compares inlet vs outlet in single chart
 *
 * FEATURES:
 * ✅ Uses useChart hook (with caching)
 * ✅ Manual refresh button
 * ✅ Loading & error states
 * ✅ Responsive design
 * ✅ Parameter selection
 */

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useTimeSeriesChart } from "../../hooks/useChart";

// ========================================
// PARAMETER CONFIGURATION
// ========================================

const PARAMETER_CONFIG = {
  ph: {
    label: "pH",
    unit: "",
    inletColor: "#3b82f6",
    outletColor: "#60a5fa",
  },
  tds: {
    label: "TDS",
    unit: "ppm",
    inletColor: "#f59e0b",
    outletColor: "#fbbf24",
  },
  turbidity: {
    label: "Turbidity",
    unit: "NTU",
    inletColor: "#ef4444",
    outletColor: "#f87171",
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    inletColor: "#8b5cf6",
    outletColor: "#a78bfa",
  },
};

// ========================================
// Component
// ========================================

function MultiParameterChart({
  ipalId,
  timeRange = "7d",
  initialParameters = ["ph", "tds"],
  height = 400,
}) {
  const [selectedParams, setSelectedParams] = useState(initialParameters);

  // Fetch chart data with caching
  const { data, loading, error, refetch, isStale, cacheAge } =
    useTimeSeriesChart(ipalId, timeRange, selectedParams);

  // Format timestamp for display
  const formatXAxis = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return timeRange === "24h"
        ? format(date, "HH:mm")
        : format(date, "MM/dd");
    } catch (e) {
      return timestamp;
    }
  };

  // Format tooltip label
  const formatTooltipLabel = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return format(date, "yyyy-MM-dd HH:mm");
    } catch (e) {
      return timestamp;
    }
  };

  // Toggle parameter selection
  const toggleParameter = (param) => {
    setSelectedParams((prev) => {
      if (prev.includes(param)) {
        // Don't allow deselecting all parameters
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== param);
      } else {
        return [...prev, param];
      }
    });
  };

  // Manual refresh
  const handleRefresh = () => {
    refetch(true); // Force refresh (bypass cache)
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ height }}
      >
        <div className="text-red-500 mb-2">Failed to load chart</div>
        <div className="text-gray-500 text-sm mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-4">
        {/* Parameter selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PARAMETER_CONFIG).map(([param, config]) => (
            <button
              key={param}
              onClick={() => toggleParameter(param)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedParams.includes(param)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <div className="flex items-center gap-2">
          {isStale && (
            <span className="text-xs text-yellow-600">
              Stale ({cacheAge}s old)
            </span>
          )}
          {!isStale && cacheAge !== null && (
            <span className="text-xs text-gray-500">
              Cached ({cacheAge}s ago)
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            {loading ? "↻" : "⟳"} Refresh
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            style={{ fontSize: "12px" }}
          />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip
            labelFormatter={formatTooltipLabel}
            contentStyle={{ fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          {/* Render lines for selected parameters */}
          {selectedParams.map((param) => {
            const config = PARAMETER_CONFIG[param];
            return (
              <React.Fragment key={param}>
                {/* Inlet line */}
                <Line
                  type="monotone"
                  dataKey={`${param}_inlet`}
                  name={`${config.label} Inlet`}
                  stroke={config.inletColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                {/* Outlet line */}
                <Line
                  type="monotone"
                  dataKey={`${param}_outlet`}
                  name={`${config.label} Outlet`}
                  stroke={config.outletColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeDasharray="5 5"
                />
              </React.Fragment>
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      {/* Footer info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {data.data_points} data points • {data.interval} aggregation • Solid:
        Inlet, Dashed: Outlet
      </div>
    </div>
  );
}

export default MultiParameterChart;

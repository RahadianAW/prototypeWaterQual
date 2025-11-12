/**
 * ========================================
 * ComparisonChart Component
 * ========================================
 * Shows inlet vs outlet for single parameter
 * With summary statistics
 *
 * FEATURES:
 * ✅ Cached data via useChart hook
 * ✅ Summary stats (avg, reduction %)
 * ✅ Manual refresh
 * ✅ Responsive
 */

import React from "react";
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
import { useComparisonChart } from "../../hooks/useChart"

// Parameter display configuration
const PARAM_CONFIG = {
  ph: { label: "pH", unit: "", color1: "#3b82f6", color2: "#10b981" },
  tds: { label: "TDS", unit: "ppm", color1: "#f59e0b", color2: "#84cc16" },
  turbidity: {
    label: "Turbidity",
    unit: "NTU",
    color1: "#ef4444",
    color2: "#06b6d4",
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    color1: "#8b5cf6",
    color2: "#ec4899",
  },
};

function ComparisonChart({
  ipalId,
  parameter,
  timeRange = "7d",
  height = 350,
}) {
  const { data, loading, error, refetch, isStale, cacheAge } =
    useComparisonChart(ipalId, parameter, timeRange);

  const config = PARAM_CONFIG[parameter] || {
    label: parameter,
    unit: "",
    color1: "#6366f1",
    color2: "#14b8a6",
  };

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

  const formatTooltipLabel = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return format(date, "yyyy-MM-dd HH:mm");
    } catch (e) {
      return timestamp;
    }
  };

  const handleRefresh = () => {
    refetch(true);
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">Loading...</div>
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
        <div className="text-red-500 mb-2">Error loading chart</div>
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

  const summary = data.summary || {};

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{config.label} Comparison</h3>
        <div className="flex items-center gap-2">
          {isStale && (
            <span className="text-xs text-yellow-600">Stale ({cacheAge}s)</span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            {loading ? "↻" : "⟳"}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {summary.inlet_avg && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-xs text-gray-600">Inlet Avg</div>
            <div className="text-xl font-bold text-blue-600">
              {summary.inlet_avg} {config.unit}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-xs text-gray-600">Outlet Avg</div>
            <div className="text-xl font-bold text-green-600">
              {summary.outlet_avg} {config.unit}
            </div>
          </div>
          <div
            className={`p-3 rounded ${
              summary.reduction_percentage > 0 ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="text-xs text-gray-600">Reduction</div>
            <div
              className={`text-xl font-bold ${
                summary.reduction_percentage > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {summary.reduction_percentage > 0 ? "+" : ""}
              {summary.reduction_percentage}%
            </div>
          </div>
        </div>
      )}

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
          <YAxis
            style={{ fontSize: "12px" }}
            label={{
              value: config.unit,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: "12px" },
            }}
          />
          <Tooltip
            labelFormatter={formatTooltipLabel}
            contentStyle={{ fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          <Line
            type="monotone"
            dataKey="inlet"
            name={`${config.label} Inlet`}
            stroke={config.color1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="outlet"
            name={`${config.label} Outlet`}
            stroke={config.color2}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {data.data_points} data points • {data.interval} interval
      </div>
    </div>
  );
}

export default ComparisonChart;

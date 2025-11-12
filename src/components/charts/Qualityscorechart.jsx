/**
 * ========================================
 * QualityScoreChart Component
 * ========================================
 * Shows quality score trend with status distribution
 *
 * FEATURES:
 * ✅ Quality score line chart
 * ✅ Status distribution badges
 * ✅ Color-coded by status
 * ✅ Cached data
 */

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useQualityScoreChart } from "../../hooks/useChart";

// Status configuration
const STATUS_CONFIG = {
  excellent: {
    label: "Excellent",
    color: "#10b981",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  good: {
    label: "Good",
    color: "#3b82f6",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  fair: {
    label: "Fair",
    color: "#f59e0b",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  poor: {
    label: "Poor",
    color: "#ef4444",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  critical: {
    label: "Critical",
    color: "#991b1b",
    bgColor: "bg-red-200",
    textColor: "text-red-900",
  },
};

// Get color for quality score
function getScoreColor(score) {
  if (score >= 80) return STATUS_CONFIG.excellent.color;
  if (score >= 60) return STATUS_CONFIG.good.color;
  if (score >= 40) return STATUS_CONFIG.fair.color;
  if (score >= 20) return STATUS_CONFIG.poor.color;
  return STATUS_CONFIG.critical.color;
}

function QualityScoreChart({
  ipalId,
  timeRange = "7d",
  height = 350,
  showDistribution = true,
}) {
  const { data, loading, error, refetch, isStale } = useQualityScoreChart(
    ipalId,
    timeRange
  );

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const color = getScoreColor(data.quality_score);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
        <div className="text-xs text-gray-600 mb-1">
          {formatTooltipLabel(data.timestamp)}
        </div>
        <div className="text-lg font-bold" style={{ color }}>
          Score: {data.quality_score}
        </div>
        <div className="text-xs capitalize mt-1">
          Status: <span className="font-semibold">{data.status}</span>
        </div>
        {data.alert_count > 0 && (
          <div className="text-xs text-red-600 mt-1">
            ⚠ {data.alert_count} alert(s)
          </div>
        )}
      </div>
    );
  };

  const handleRefresh = () => {
    refetch(true);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

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

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const distribution = data.status_distribution || {};

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Water Quality Score</h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          {loading ? "↻" : "⟳"}
        </button>
      </div>

      {/* Status Distribution */}
      {showDistribution && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.entries(distribution).map(([status, count]) => {
            if (count === 0) return null;
            const config = STATUS_CONFIG[status];
            if (!config) return null;

            return (
              <div
                key={status}
                className={`px-3 py-1 rounded ${config.bgColor} ${config.textColor} text-xs font-medium`}
              >
                {config.label}: {count}
              </div>
            );
          })}
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
            domain={[0, 100]}
            style={{ fontSize: "12px" }}
            label={{
              value: "Score",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: "12px" },
            }}
          />

          {/* Reference lines for status thresholds */}
          <ReferenceLine
            y={80}
            stroke="#10b981"
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />
          <ReferenceLine
            y={60}
            stroke="#3b82f6"
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />
          <ReferenceLine
            y={40}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />
          <ReferenceLine
            y={20}
            stroke="#ef4444"
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="quality_score"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 3, fill: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {data.data_points} readings • Score range: 0-100
      </div>
    </div>
  );
}

export default QualityScoreChart;

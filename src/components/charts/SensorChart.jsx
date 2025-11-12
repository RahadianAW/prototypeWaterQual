/**
 * ========================================
 * SensorChart Component (HYBRID)
 * ========================================
 * Supports TWO modes:
 * 1. Fetch mode: Pass sensorId + ipalId (fetches from API)
 * 2. Manual mode: Pass data directly (for backward compatibility)
 * 
 * FEATURES:
 * ✅ Auto-detect mode based on props
 * ✅ Cached data (fetch mode)
 * ✅ Manual refresh
 * ✅ Statistics display
 * ✅ Responsive
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useSensorChart } from '../../hooks/useChart';

// Parameter configuration
const PARAM_CONFIG = {
  ph: { 
    label: 'pH', 
    unit: '', 
    color: '#3b82f6',
    gradient: ['#3b82f6', '#60a5fa'],
  },
  tds: { 
    label: 'TDS', 
    unit: 'ppm', 
    color: '#f59e0b',
    gradient: ['#f59e0b', '#fbbf24'],
  },
  turb: { 
    label: 'Turbidity', 
    unit: 'NTU', 
    color: '#ef4444',
    gradient: ['#ef4444', '#f87171'],
  },
  turbidity: { 
    label: 'Turbidity', 
    unit: 'NTU', 
    color: '#ef4444',
    gradient: ['#ef4444', '#f87171'],
  },
  temp: { 
    label: 'Temperature', 
    unit: '°C', 
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#a78bfa'],
  },
  temperature: { 
    label: 'Temperature', 
    unit: '°C', 
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#a78bfa'],
  },
};

// Parse sensor ID to get parameter and location
function parseSensorInfo(sensorId) {
  // Handle undefined/null sensorId
  if (!sensorId || typeof sensorId !== 'string') {
    return { 
      parameter: 'unknown', 
      location: 'unknown', 
      label: 'Unknown Sensor',
      unit: '',
      color: '#6366f1',
      gradient: ['#6366f1', '#818cf8'],
    };
  }

  // Format: "sensor-ph-inlet-001"
  const parts = sensorId.split('-');
  
  if (parts.length < 3) {
    return { 
      parameter: 'unknown', 
      location: 'unknown', 
      label: sensorId,
      unit: '',
      color: '#6366f1',
      gradient: ['#6366f1', '#818cf8'],
    };
  }

  const param = parts[1]; // ph, tds, turb, temp
  const location = parts[2]; // inlet, outlet
  
  const config = PARAM_CONFIG[param] || { 
    label: param, 
    unit: '', 
    color: '#6366f1',
    gradient: ['#6366f1', '#818cf8'],
  };

  return {
    parameter: param,
    location: location,
    label: `${config.label} ${location.charAt(0).toUpperCase() + location.slice(1)}`,
    unit: config.unit,
    color: config.color,
    gradient: config.gradient,
  };
}

function SensorChart({ 
  // Mode 1: Fetch from API
  sensorId,
  ipalId,
  timeRange = '7d',
  
  // Mode 2: Manual data
  data: manualData,
  dataKey = 'value',
  name: manualName,
  color: manualColor,
  unit: manualUnit,
  
  // Common props
  height = 350,
  chartType = 'line', // 'line' or 'area'
}) {
  // Detect mode
  const isFetchMode = sensorId && ipalId && !manualData;
  
  // Fetch mode: Use hook
  const hookResult = useSensorChart(
    sensorId,
    ipalId,
    timeRange,
    { enabled: isFetchMode } // Only fetch if in fetch mode
  );

  // Determine data source
  const isLoading = isFetchMode ? hookResult.loading : false;
  const error = isFetchMode ? hookResult.error : null;
  const refetch = isFetchMode ? hookResult.refetch : null;
  const isStale = isFetchMode ? hookResult.isStale : false;
  const cacheAge = isFetchMode ? hookResult.cacheAge : null;

  // Chart data
  const chartData = isFetchMode 
    ? hookResult.data?.data || []
    : manualData || [];

  // Stats
  const stats = isFetchMode
    ? hookResult.data?.statistics
    : calculateManualStats(manualData, dataKey);

  // Sensor info
  const sensorInfo = isFetchMode
    ? parseSensorInfo(sensorId)
    : {
        label: manualName || 'Sensor',
        unit: manualUnit || '',
        color: manualColor || '#3b82f6',
        gradient: [manualColor || '#3b82f6', manualColor || '#60a5fa'],
      };

  const formatXAxis = (timestamp) => {
    try {
      // Handle both ISO string and formatted time
      if (timestamp.includes('T')) {
        const date = parseISO(timestamp);
        return timeRange === '24h' 
          ? format(date, 'HH:mm')
          : format(date, 'MM/dd');
      }
      return timestamp; // Already formatted
    } catch (e) {
      return timestamp;
    }
  };

  const formatTooltipLabel = (timestamp) => {
    try {
      if (timestamp.includes('T')) {
        const date = parseISO(timestamp);
        return format(date, 'yyyy-MM-dd HH:mm');
      }
      return timestamp;
    } catch (e) {
      return timestamp;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
        <div className="text-xs text-gray-600 mb-1">
          {formatTooltipLabel(payload[0].payload.timestamp)}
        </div>
        <div className="text-lg font-bold" style={{ color: sensorInfo.color }}>
          {value} {sensorInfo.unit}
        </div>
      </div>
    );
  };

  const handleRefresh = () => {
    if (refetch) {
      refetch(true);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">Loading sensor data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height }}>
        <div className="text-red-500 mb-2">Failed to load sensor data</div>
        <div className="text-gray-500 text-sm mb-4">{error}</div>
        {refetch && (
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // No data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height }}>
        <div className="text-gray-500 mb-2">No data available</div>
        {refetch && (
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold">{sensorInfo.label}</h3>
          {isFetchMode && sensorId && (
            <div className="text-xs text-gray-500">{sensorId}</div>
          )}
        </div>
        {refetch && (
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
              disabled={isLoading}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
            >
              {isLoading ? '↻' : '⟳'} Refresh
            </button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-xs text-gray-600">Average</div>
            <div className="text-xl font-bold text-blue-600">
              {stats.avg} {sensorInfo.unit}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-xs text-gray-600">Minimum</div>
            <div className="text-xl font-bold text-green-600">
              {stats.min} {sensorInfo.unit}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-xs text-gray-600">Maximum</div>
            <div className="text-xl font-bold text-red-600">
              {stats.max} {sensorInfo.unit}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {chartType === 'area' ? (
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`gradient-${sensorId || 'manual'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={sensorInfo.gradient[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={sensorInfo.gradient[1]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              style={{ fontSize: '12px' }}
              label={{ 
                value: sensorInfo.unit, 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={sensorInfo.color}
              strokeWidth={2}
              fill={`url(#gradient-${sensorId || 'manual'})`}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        ) : (
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              style={{ fontSize: '12px' }}
              label={{ 
                value: sensorInfo.unit, 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={sensorInfo.label}
              stroke={sensorInfo.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Footer Info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {chartData.length} data points
        {isFetchMode && hookResult.data?.interval && ` • ${hookResult.data.interval} interval`}
      </div>
    </div>
  );
}

// Helper: Calculate stats from manual data
function calculateManualStats(data, dataKey) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => d[dataKey]).filter(v => v != null);
  
  if (values.length === 0) return null;

  return {
    avg: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)),
    min: parseFloat(Math.min(...values).toFixed(2)),
    max: parseFloat(Math.max(...values).toFixed(2)),
  };
}

export default SensorChart;
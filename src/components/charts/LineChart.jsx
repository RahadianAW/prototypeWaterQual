// src/components/charts/LineChart.jsx
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

const LineChart = ({ data, dataKey, name, color, unit }) => {
  // Format untuk timestamp pada tooltip
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'HH:mm, dd MMM yyyy');
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {`${name}: ${payload[0].value} ${unit || ''}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => format(parseISO(timestamp), 'HH:mm')}
        />
        <YAxis
          tickFormatter={(value) => `${value}${unit ? ` ${unit}` : ''}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color || '#0ea5e9'}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
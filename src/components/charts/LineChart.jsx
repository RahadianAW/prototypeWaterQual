// src/components/charts/LineChart.jsx
import React, { useState } from 'react';
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
  const windowSize = 12; 
  const totalDays = Math.ceil(data.length / windowSize);

  const [dayIndex, setDayIndex] = useState(0); // mulai dari Day 1

  const startIndex = dayIndex * windowSize;
  const endIndex = Math.min(startIndex + windowSize, data.length);
  const visibleData = data.slice(startIndex, endIndex);

  const handleNext = () => {
    if (dayIndex < totalDays - 1) {
      setDayIndex(dayIndex + 1);
    }
  };

  const handlePrev = () => {
    if (dayIndex > 0) {
      setDayIndex(dayIndex - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'HH:mm');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 items-center">
        <button
          onClick={handlePrev}
          disabled={dayIndex === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium">{`Day ${dayIndex + 1} / ${totalDays}`}</span>
        <button
          onClick={handleNext}
          disabled={dayIndex >= totalDays - 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={visibleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="timestamp" tickFormatter={(t) => formatDate(t)} />
          <YAxis tickFormatter={(v) => `${v}${unit ? ` ${unit}` : ''}`} />
          <Tooltip
            labelFormatter={(t) => format(parseISO(t), 'yyyy-MM-dd HH:mm')}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color || '#0ea5e9'}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;

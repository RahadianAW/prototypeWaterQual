// src/components/charts/GaugeChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value, min, max, thresholds, title, unit }) => {
  // Menghitung persentase nilai dari minimum-maximum
  const percent = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  // Menentukan warna berdasarkan ambang batas
  const getColor = () => {
    if (thresholds) {
      const { warning, danger } = thresholds;
      if (value >= danger) return '#ef4444'; // danger-500
      if (value >= warning) return '#f59e0b'; // warning-500
      return '#22c55e'; // success-500
    }
    return '#22c55e'; // Default color
  };

  // Data untuk pie chart
  const data = [
    { name: 'Value', value: percent },
    { name: 'Empty', value: 100 - percent }
  ];

  // CSS untuk membuat gauge setengah lingkaran
  const RADIAN = Math.PI / 180;
  const cx = 150;
  const cy = 150;
  const radius = 100;
  const startAngle = 180;
  const endAngle = 0;

  // Label di tengah gauge
  const GaugeLabel = () => {
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-2xl font-bold"
        fill="#374151" // text-gray-700
      >
        {value}
        {unit && <tspan className="text-lg font-normal" dx="2">{unit}</tspan>}
      </text>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-gray-500 text-center mb-2">{title}</h4>
      )}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx={cx}
              cy={cy}
              innerRadius={radius * 0.7}
              outerRadius={radius}
              startAngle={startAngle}
              endAngle={endAngle}
              paddingAngle={0}
              dataKey="value"
              cornerRadius={6}
              stroke="none"
            >
              <Cell key="value" fill={getColor()} />
              <Cell key="empty" fill="#e5e7eb" /> {/* gray-200 */}
            </Pie>
            <GaugeLabel />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-4 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default GaugeChart;
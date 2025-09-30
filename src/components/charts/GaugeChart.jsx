// src/components/charts/GaugeChart.jsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const GaugeChart = ({ value = 0, min = 0, max = 100, threshold, status: statusProp, title, unit }) => {
  // safety: pastikan min < max
  const safeMin = Number(min ?? 0);
  const safeMax = Number(max ?? 100);
  const range = safeMax - safeMin || 1;

  // persentase 0..100
  const percent = Math.min(Math.max(((Number(value) - safeMin) / range) * 100, 0), 100);

  // tentukan status
  const getStatus = () => {
    if (statusProp) {
      // pakai status dari data (normal/warning/danger), normalisasi ke lowercase
      return String(statusProp).toLowerCase();
    }

    if (threshold && typeof threshold === "object" && "min" in threshold && "max" in threshold) {
      const tMin = Number(threshold.min);
      const tMax = Number(threshold.max);

      // kalau keluar ambang -> danger
      if (value < tMin || value > tMax) return "danger";

      // tambahkan zona warning: mis. 10% dari rentang threshold
      const warnMargin = 0.1 * (tMax - tMin || 1);
      if (value <= tMin + warnMargin || value >= tMax - warnMargin) return "warning";

      return "normal";
    }

    // fallback default
    return "normal";
  };

  const status = getStatus();

  const COLORS = {
    normal: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
  };

  // data untuk pie gauge
  const data = [
    { name: "value", value: percent },
    { name: "rest", value: 100 - percent },
  ];

  const GaugeLabel = ({ cx, cy }) => (
    <text
      x={cx}
      y={cy - 10}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="16"
      fontWeight="700"
      fill="#374151"
    >
      {value}
      {unit && <tspan dx="4" fontSize="12" fontWeight="400">{unit}</tspan>}
    </text>
  );

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-medium text-gray-500 text-center mb-2">{title}</h4>}

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
              label={GaugeLabel}
              labelLine={false}
            >
              <Cell fill={COLORS[status] || COLORS.normal} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs text-gray-500 px-4 mt-2">
        <span>{threshold ? `${threshold.min}${unit ?? ""}` : `${min}${unit ?? ""}`}</span>
        <span>{threshold ? `${threshold.max}${unit ?? ""}` : `${max}${unit ?? ""}`}</span>
      </div>

      <p className="text-center text-sm mt-1 font-medium" style={{ color: COLORS[status] || COLORS.normal }}>
        {String(status).toUpperCase()}
      </p>
    </div>
  );
};

export default GaugeChart;

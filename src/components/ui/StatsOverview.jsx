// src/components/dashboard/StatsOverview.jsx
import React from "react";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Droplets,
} from "lucide-react";

const StatsOverview = ({
  qualityScore = 0,
  status,
  lastUpdate,
  showTrend = false,
  trend = 0, // positive = improving, negative = declining
  additionalStats = [],
}) => {
  const getStatusConfig = (status) => {
    const statusMap = {
      "Sangat Baik": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-green-500",
      },
      Baik: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: TrendingUp,
        gradient: "from-green-500 to-emerald-500",
      },
      Sedang: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: Minus,
        gradient: "from-yellow-500 to-orange-400",
      },
      Buruk: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: TrendingDown,
        gradient: "from-orange-500 to-red-500",
      },
      "Sangat Buruk": {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: TrendingDown,
        gradient: "from-red-500 to-rose-600",
      },
    };
    return (
      statusMap[status] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: Minus,
        gradient: "from-gray-400 to-gray-500",
      }
    );
  };

  const getScoreConfig = (score) => {
    if (score >= 80)
      return {
        color: "text-emerald-600",
        ring: "ring-emerald-500",
        bg: "bg-emerald-500",
      };
    if (score >= 60)
      return {
        color: "text-green-600",
        ring: "ring-green-500",
        bg: "bg-green-500",
      };
    if (score >= 40)
      return {
        color: "text-yellow-600",
        ring: "ring-yellow-500",
        bg: "bg-yellow-500",
      };
    if (score >= 20)
      return {
        color: "text-orange-600",
        ring: "ring-orange-500",
        bg: "bg-orange-500",
      };
    return {
      color: "text-red-600",
      ring: "ring-red-500",
      bg: "bg-red-500",
    };
  };

  const statusConfig = status ? getStatusConfig(status) : null;
  const scoreConfig = getScoreConfig(qualityScore);
  const StatusIcon = statusConfig?.icon || Minus;

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
      {/* Header dengan gradient */}
      <div
        className={`h-2 bg-gradient-to-r ${
          statusConfig?.gradient || "from-blue-500 to-indigo-500"
        }`}
      />

      <div className="p-6">
        {/* Main Stats */}
        <div className="flex items-center justify-between mb-6">
          {/* Quality Score */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Circular progress background */}
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                    statusConfig?.gradient || "from-blue-500 to-indigo-500"
                  } flex items-center justify-center`}
                >
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Water Quality Score
              </p>
              <div className="flex items-baseline space-x-2">
                <p className={`text-5xl font-bold ${scoreConfig.color}`}>
                  {qualityScore}
                </p>
                <span className="text-2xl text-gray-400 font-medium">/100</span>
              </div>

              {/* Trend indicator */}
              {showTrend && (
                <div className="flex items-center space-x-1 mt-1">
                  {getTrendIcon()}
                  <span
                    className={`text-sm font-medium ${
                      trend > 0
                        ? "text-green-600"
                        : trend < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {trend > 0 ? "+" : ""}
                    {trend}% from last reading
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          {status && statusConfig && (
            <div
              className={`
              px-6 py-4 rounded-xl border-2 
              ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}
              shadow-sm
            `}
            >
              <div className="flex items-center space-x-3">
                <StatusIcon className="w-6 h-6" />
                <div>
                  <p className="text-xs font-medium opacity-75 uppercase tracking-wide">
                    Status
                  </p>
                  <p className="text-xl font-bold">{status}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4" />

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm">
          {/* Last Update */}
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                Last updated:{" "}
                <strong className="text-gray-700">
                  {new Date(lastUpdate).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </strong>
              </span>
            </div>
          )}

          {/* Additional Stats */}
          {additionalStats.length > 0 && (
            <div className="flex items-center space-x-4">
              {additionalStats.map((stat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {stat.icon && <stat.icon className="w-4 h-4 text-gray-400" />}
                  <span className="text-gray-500">
                    {stat.label}:{" "}
                    <strong className="text-gray-700">{stat.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                statusConfig?.gradient || "from-blue-500 to-indigo-500"
              } transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;

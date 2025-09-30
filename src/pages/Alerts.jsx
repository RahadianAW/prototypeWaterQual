// src/pages/Alerts.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Droplet,
  Thermometer,
  Waves,
  Eye,
} from "lucide-react";
import { alerts, sensors } from "../data/dummyData";
import { format, parseISO } from "date-fns";

const Alerts = () => {
  const [filter, setFilter] = useState("all");
  const [parameterFilter, setParameterFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    const statusMatch = filter === "all" || alert.status === filter;
    const parameterMatch =
      parameterFilter === "all" || alert.parameter === parameterFilter;
    return statusMatch && parameterMatch;
  });

  // Ikon parameter dengan warna tergantung status
  const getParameterIcon = (alert) => {
    const baseClass = "h-5 w-5";
    const colorClass =
      alert.status === "active" ? "text-yellow-600" : "text-green-600";

    switch (alert.parameter) {
      case "pH":
        return <Droplet className={`${baseClass} ${colorClass}`} />;
      case "Temperature":
        return <Thermometer className={`${baseClass} ${colorClass}`} />;
      case "TDS":
        return <Waves className={`${baseClass} ${colorClass}`} />;
      case "Turbidity":
        return <Eye className={`${baseClass} ${colorClass}`} />;
      default:
        return <AlertTriangle className={`${baseClass} ${colorClass}`} />;
    }
  };

  const getLocationName = (sensorId) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.location : "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Alerts</h2>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 hover:shadow-md transition-all"
          >
            <Filter className="mr-2 h-5 w-5 text-gray-500" />
            Filter
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
              {/* Status Filter */}
              <div className="py-2">
                <p className="px-4 pb-1 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </p>
                {["all", "active", "resolved"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      filter === f
                        ? "bg-yellow-100 text-yellow-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Parameter Filter */}
              <div className="py-2">
                <p className="px-4 pb-1 text-xs font-semibold text-gray-500 uppercase">
                  Parameter
                </p>
                {["all", "pH", "Temperature", "TDS", "Turbidity"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setParameterFilter(p)}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      parameterFilter === p
                        ? "bg-yellow-100 text-yellow-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p === "all" ? "All Parameters" : p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-4 flex items-center">
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-4">
            <AlertTriangle className="h-7 w-7 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Total Alerts</h3>
            <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
          </div>
        </div>

        <div className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-4 flex items-center">
          <div className="flex-shrink-0 rounded-full bg-yellow-100 p-4">
            <AlertTriangle className="h-7 w-7 text-yellow-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
            <p className="text-2xl font-bold text-gray-900">
              {alerts.filter((a) => a.status === "active").length}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-4 flex items-center">
          <div className="flex-shrink-0 rounded-full bg-green-100 p-4">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">
              Resolved Alerts
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {alerts.filter((a) => a.status === "resolved").length}
            </p>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Alert List</h3>
          <p className="mt-1 text-sm text-gray-500">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </p>
        </div>

        {filteredAlerts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 flex items-start hover:bg-gray-50 transition"
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`p-2 rounded-full ${
                      alert.status === "active"
                        ? "bg-yellow-100"
                        : "bg-green-100"
                    }`}
                  >
                    {getParameterIcon(alert)}
                  </div>
                </div>

                {/* Alert Info */}
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-base font-semibold text-gray-900">
                      {alert.parameter} Alert
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        alert.status === "active"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.status === "active" ? "Active" : "Resolved"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">{alert.message}</p>

                  <div className="mt-2 text-sm text-gray-500 space-x-4">
                    <span>Value: {alert.value}</span>
                    <span>Threshold: {alert.threshold}</span>
                  </div>

                  <div className="mt-1 text-xs text-gray-400 flex items-center space-x-2">
                    <span>{getLocationName(alert.sensorId)}</span>
                    <span>•</span>
                    <span>
                      {format(parseISO(alert.timestamp), "dd MMM yyyy, HH:mm")}
                    </span>
                  </div>
                </div>

                {/* View Sensor Link */}
                <div className="ml-4 flex-shrink-0">
                  <Link
                    to={`/sensors/${alert.sensorId}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline"
                  >
                    View Sensor →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No alerts found with the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;

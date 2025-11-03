// src/pages/Sensors.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineSensors,
  MdArrowForward,
  MdRefresh,
  MdCheckCircle,
  MdError,
  MdAccessTime,
} from "react-icons/md";
import sensorService from "../services/sensorServices";

const Sensors = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      const data = await sensorService.getAllSensors({ ipal_id: 1 });

      // Fetch latest reading untuk setiap sensor
      const sensorsWithReadings = await Promise.all(
        data.map(async (sensor) => {
          try {
            const latestData = await sensorService.getSensorLatestReading(
              sensor.id
            );
            return {
              ...sensor,
              latest_reading: latestData.latest_reading,
            };
          } catch (error) {
            return {
              ...sensor,
              latest_reading: null,
            };
          }
        })
      );

      setSensors(sensorsWithReadings);
    } catch (error) {
      console.error("Error fetching sensors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSensors();
    setRefreshing(false);
  };

  // Group sensors by location
  const groupedSensors = sensors.reduce((acc, sensor) => {
    const location = sensor.sensor_location || "Unknown";
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(sensor);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    return status === "active" ? "bg-green-500" : "bg-gray-300";
  };

  const getSensorTypeLabel = (type) => {
    const labels = {
      ph: "pH",
      tds: "TDS",
      turbidity: "Turbidity",
      temperature: "Temperature",
    };
    return labels[type] || type;
  };

  const getSensorUnit = (type) => {
    const units = {
      ph: "",
      tds: "ppm",
      turbidity: "NTU",
      temperature: "°C",
    };
    return units[type] || "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <MdOutlineSensors className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Sensor Management
            </h2>
            <p className="text-sm text-gray-500">
              Monitor all sensors in IPAL UNDIP
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <MdRefresh className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sensors</p>
              <p className="text-2xl font-bold text-gray-900">
                {sensors.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdOutlineSensors className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {sensors.filter((s) => s.status === "active").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MdCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inlet Sensors</p>
              <p className="text-2xl font-bold text-gray-900">
                {sensors.filter((s) => s.sensor_location === "inlet").length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MdArrowForward className="h-6 w-6 text-purple-600 rotate-180" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Outlet Sensors</p>
              <p className="text-2xl font-bold text-gray-900">
                {sensors.filter((s) => s.sensor_location === "outlet").length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MdArrowForward className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sensors Grid - Grouped by Location */}
      {Object.entries(groupedSensors).map(([location, locationSensors]) => (
        <div key={location} className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {location}
            </h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {locationSensors.length} sensors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locationSensors.map((sensor) => (
              <Link
                key={sensor.id}
                to={`/sensors/${sensor.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary-300 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition">
                      {getSensorTypeLabel(sensor.sensor_type)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {sensor.sensor_location}
                    </p>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(
                      sensor.status
                    )}`}
                  ></div>
                </div>

                {/* Latest Reading */}
                {sensor.latest_reading ? (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Latest Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {sensor.latest_reading.value}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        {getSensorUnit(sensor.sensor_type)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                      <MdAccessTime className="mr-1" />
                      {new Date(
                        sensor.latest_reading.timestamp
                      ).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-400 text-center">
                      No data available
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full ${
                      sensor.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {sensor.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <span className="text-primary-600 group-hover:underline flex items-center font-medium">
                    View Details
                    <MdArrowForward className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {sensors.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MdError className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Sensors Found
          </h3>
          <p className="text-gray-500 mb-6">
            There are no sensors configured for this IPAL.
          </p>
        </div>
      )}
    </div>
  );
};

export default Sensors;

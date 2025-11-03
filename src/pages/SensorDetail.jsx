// src/pages/SensorDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdOutlineHistory,
  MdCheckCircle,
  MdError,
  MdAccessTime,
  MdCalendarToday,
  MdRefresh,
} from "react-icons/md";
import sensorService from "../services/sensorServices";
import LineChart from "../components/charts/LineChart";

const SensorDetail = () => {
  const { id } = useParams();
  const [sensor, setSensor] = useState(null);
  const [latestReading, setLatestReading] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [historyLimit, setHistoryLimit] = useState(100);

  useEffect(() => {
    fetchSensorData();
  }, [id]);

  const fetchSensorData = async () => {
    try {
      setLoading(true);

      // Fetch sensor metadata
      const sensorData = await sensorService.getSensorById(id);
      console.log("🔍 Sensor data:", sensorData);
      setSensor(sensorData);

      // Fetch latest reading
      try {
        const latestData = await sensorService.getSensorLatestReading(id);
        console.log("🔍 Latest reading response:", latestData);
        setLatestReading(latestData?.latest_reading || null);
      } catch (error) {
        console.warn("No latest reading available:", error);
        setLatestReading(null);
      }

      // Fetch history
      try {
        const historyData = await sensorService.getSensorHistory(id, {
          limit: historyLimit,
        });
        console.log("🔍 History response:", historyData);
        setHistory(historyData?.history || []);
      } catch (error) {
        console.warn("No history available:", error);
        setHistory([]);
      }
    } catch (error) {
      console.error("❌ Error fetching sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchSensorData();
  };

  const getSensorTypeLabel = (type) => {
    const labels = {
      ph: "pH",
      tds: "TDS (Total Dissolved Solids)",
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

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <MdCheckCircle className="mr-1" /> Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
        <MdError className="mr-1" /> Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <MdError className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Sensor Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The sensor with ID "{id}" could not be found.
        </p>
        <Link
          to="/sensors"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <MdArrowBack className="mr-1" /> Back to Sensors
        </Link>
      </div>
    );
  }

  const unit = getSensorUnit(sensor.sensor_type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/sensors"
              className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition"
            >
              <MdArrowBack className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getSensorTypeLabel(sensor.sensor_type)}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {sensor.sensor_description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {getStatusBadge(sensor.status)}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition"
            >
              <MdRefresh className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <nav className="-mb-px flex space-x-8 px-6">
          {["overview", "history", "info"].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" && "Overview"}
              {tab === "history" && (
                <div className="flex items-center">
                  <MdOutlineHistory className="mr-2" /> History
                </div>
              )}
              {tab === "info" && "Sensor Info"}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="p-6 space-y-6">
            {/* Latest Reading Card */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Reading
              </h3>

              {latestReading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Value Card */}
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                    <div className="text-sm text-gray-600 mb-2">
                      Current Value
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {latestReading.value}
                      <span className="text-xl font-normal text-gray-600 ml-2">
                        {unit}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                      <MdAccessTime className="mr-1" />
                      {new Date(latestReading.timestamp).toLocaleString(
                        "id-ID",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </div>
                  </div>

                  {/* Sensor Info */}
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Sensor Type</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getSensorTypeLabel(sensor.sensor_type)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {sensor.sensor_location}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {sensor.status}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">
                        Total Readings
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {history.length}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
                  <MdError className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No current data available for this sensor
                  </p>
                </div>
              )}
            </div>

            {/* Recent History Chart */}
            {history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Trend (Last 24 hours)
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <LineChart
                    data={history.slice(0, 24).reverse()}
                    dataKey="value"
                    name={getSensorTypeLabel(sensor.sensor_type)}
                    unit={unit}
                    color="#3b82f6"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Historical Data
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Showing:</span>
                <select
                  value={historyLimit}
                  onChange={(e) => {
                    setHistoryLimit(Number(e.target.value));
                    fetchSensorData();
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={50}>Last 50</option>
                  <option value={100}>Last 100</option>
                  <option value={200}>Last 200</option>
                </select>
              </div>
            </div>

            {history.length > 0 ? (
              <>
                {/* Chart */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <LineChart
                    data={history.slice().reverse()}
                    dataKey="value"
                    name={getSensorTypeLabel(sensor.sensor_type)}
                    unit={unit}
                    color="#3b82f6"
                  />
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reading ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.slice(0, 50).map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <MdCalendarToday className="mr-2 text-gray-400" />
                              {new Date(item.timestamp).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.value} {unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {item.reading_id.substring(0, 8)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
                <MdError className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No historical data available for this sensor
                </p>
              </div>
            )}
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sensor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Sensor ID</p>
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {sensor.id}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Sensor Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {getSensorTypeLabel(sensor.sensor_type)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {sensor.sensor_location}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {sensor.status}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm font-medium text-gray-900">
                    {sensor.sensor_description}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Added By</p>
                  <p className="text-sm font-medium text-gray-900">
                    {sensor.added_by || "System"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Added At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {sensor.added_at
                      ? new Date(sensor.added_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </p>
                </div>

                {sensor.last_calibration && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      Last Calibration
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(sensor.last_calibration).toLocaleString(
                        "id-ID",
                        {
                          dateStyle: "medium",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorDetail;

// src/pages/SensorDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MdArrowBack,
  MdOutlineHistory,
  MdOutlineSettings,
  MdCheckCircle,
  MdError,
  MdWarning,
} from 'react-icons/md';
import {
  sensors,
  historicalData,
  currentWaterQuality,
} from '../data/dummyData';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';

const SensorDetail = () => {
  const { id } = useParams();
  const [sensor, setSensor] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [thresholds, setThresholds] = useState({ warning: 0, danger: 0 });

  // Setting parameter sesuai sensor
  const getParameterSettings = (type = sensor?.type) => {
    switch (type) {
      case "pH Sensor":
        return {
          min: 0,
          max: 14,
          unit: "",
          thresholds: { warning: 6.5, danger: 8.5 },
        };
      case "Temperature Sensor":
        return {
          min: 0,
          max: 50,
          unit: "°C",
          thresholds: { warning: 25, danger: 30 },
        };
      case "TDS Sensor":
        return {
          min: 0,
          max: 1000,
          unit: "ppm",
          thresholds: { warning: 400, danger: 500 },
        };
      case "Turbidity Sensor":
        return {
          min: 0,
          max: 20,
          unit: "NTU",
          thresholds: { warning: 5, danger: 10 },
        };
      default:
        return { min: 0, max: 100, unit: "", thresholds: {} };
    }
  };

  // Helper status calculation
  const getStatusFromValue = (value, sensorType, thresholds) => {
    if (!thresholds) return "normal";

    switch (sensorType) {
      case "pH Sensor":
        if (value < thresholds.warning || value > thresholds.danger) {
          return "danger";
        }
        // optional warning zone (misal terlalu dekat ke batas)
        else if (value === thresholds.warning || value === thresholds.danger) {
          return "warning";
        }
        return "normal";

      case "Temperature Sensor":
      case "TDS Sensor":
      case "Turbidity Sensor":
        if (value >= thresholds.danger) return "danger";
        else if (value >= thresholds.warning) return "warning";
        else return "normal";

      default:
        return "normal";
    }
  };

  useEffect(() => {
    const sensorId = parseInt(id);
    const foundSensor = sensors.find((s) => s.id === sensorId);

    if (foundSensor) {
      setSensor(foundSensor);

      // cari data terkini
      const data = currentWaterQuality.find((d) => d.sensorId === sensorId);

      if (data) {
        const defaultSettings = getParameterSettings(foundSensor.type);
        const computedStatus = getStatusFromValue(
          data.value,
          foundSensor.type,
          defaultSettings.thresholds
        );

        setCurrentData({ ...data, status: computedStatus });
        setThresholds(defaultSettings.thresholds);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900">Sensor not found</h2>
        <p className="mt-2 text-gray-500">
          The sensor with ID {id} could not be found.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <MdArrowBack className="mr-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Ambil data historis sesuai tipe sensor
  const getHistoricalDataByType = () => {
    switch (sensor.type) {
      case 'pH Sensor':
        return historicalData.ph;
      case 'Temperature Sensor':
        return historicalData.temperature;
      case 'TDS Sensor':
        return historicalData.tds;
      case 'Turbidity Sensor':
        return historicalData.turbidity;
      default:
        return [];
    }
  };

  const paramSettings = getParameterSettings();
  const historicalDataForSensor = getHistoricalDataByType();

  // Badge status helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <MdCheckCircle className="mr-1" /> Normal
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <MdWarning className="mr-1" /> Warning
          </span>
        );
      case 'danger':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <MdError className="mr-1" /> Danger
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/sensors"
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
          >
            <MdArrowBack className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{sensor.type}</h2>
            <p className="text-gray-500">{sensor.location}</p>
          </div>
        </div>
        {currentData && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Latest Value</p>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.value} {currentData.unit}
            </p>
            {getStatusBadge(currentData.status)}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {['overview', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-all ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'history' && (
                <div className="flex items-center">
                  <MdOutlineHistory className="mr-1" /> History
                </div>
              )}
              {tab === 'settings' && (
                <div className="flex items-center">
                  <MdOutlineSettings className="mr-1" /> Settings
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Reading
            </h3>

            {currentData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current value */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
                  <div className="text-sm text-gray-500 mb-1">Current Value</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {currentData.value}
                    <span className="text-lg font-normal text-gray-500 ml-1">
                      {currentData.unit}
                    </span>
                  </div>
                  <div className="mt-2">{getStatusBadge(currentData.status)}</div>

                  {/* progress bar */}
                  <div className="mt-4 text-sm text-gray-500">
                    <div className="flex justify-between mb-1">
                      <span>
                        Min: {paramSettings.min}
                        {currentData.unit}
                      </span>
                      <span>
                        Max: {paramSettings.max}
                        {currentData.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${currentData.status === 'normal'
                            ? 'bg-green-500'
                            : currentData.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        style={{
                          width: `${((currentData.value - paramSettings.min) /
                            (paramSettings.max - paramSettings.min)) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Gauge chart */}
                <div>
                  <GaugeChart
                    value={currentData.value}
                    min={paramSettings.min}
                    max={paramSettings.max}
                    thresholds={thresholds}
                    status={currentData.status}
                    title={currentData.parameter}
                    unit={currentData.unit}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                No current data available for this sensor.
              </div>
            )}

            {/* recent history */}
            {historicalDataForSensor.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent History
                </h3>
                <LineChart
                  data={historicalDataForSensor.slice(-8)}
                  dataKey="value"
                  name={sensor.type.split(' ')[0]}
                  unit={paramSettings.unit}
                  color="#0ea5e9"
                />
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Historical Data
            </h3>

            {historicalDataForSensor.length > 0 ? (
              <>
                <div className="mb-6">
                  <LineChart
                    data={historicalDataForSensor}
                    dataKey="value"
                    name={sensor.type.split(' ')[0]}
                    unit={paramSettings.unit}
                    color="#0ea5e9"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicalDataForSensor.map((data, idx) => {
                        const status = getStatusFromValue(
                          data.value,
                          sensor.type,
                          thresholds
                        );

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {new Date(data.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {data.value} {paramSettings.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(status)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                No historical data available for this sensor.
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sensor Settings
            </h3>

            {/* Sensor Information */}
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="text-md font-semibold mb-4">Sensor Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Sensor ID</p>
                  <p className="text-sm font-medium">{sensor.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium">{sensor.type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">{sensor.location}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm font-medium">{sensor.description}</p>
                </div>
              </div>
            </div>

            {/* Threshold Settings */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h4 className="text-md font-semibold mb-4">Threshold Settings</h4>

              {/* Min Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min {paramSettings.unit && `(${paramSettings.unit})`}
                </label>
                <input
                  type="number"
                  value={thresholds.warning}
                  onChange={(e) =>
                    setThresholds((prev) => ({
                      ...prev,
                      warning: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg p-2 mb-2"
                />
                <input
                  type="range"
                  min={paramSettings.min}
                  max={paramSettings.max}
                  step="0.1"
                  value={thresholds.warning}
                  onChange={(e) =>
                    setThresholds((prev) => ({
                      ...prev,
                      warning: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              {/* Max Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max {paramSettings.unit && `(${paramSettings.unit})`}
                </label>
                <input
                  type="number"
                  value={thresholds.danger}
                  onChange={(e) =>
                    setThresholds((prev) => ({
                      ...prev,
                      danger: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg p-2 mb-2"
                />
                <input
                  type="range"
                  min={paramSettings.min}
                  max={paramSettings.max}
                  step="0.1"
                  value={thresholds.danger}
                  onChange={(e) =>
                    setThresholds((prev) => ({
                      ...prev,
                      danger: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                Save Settings
              </button>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="text-md font-semibold mb-4">Notification Settings</h4>
              <div className="space-y-4">

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorDetail;

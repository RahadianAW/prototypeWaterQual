// src/pages/SensorDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack, MdOutlineHistory, MdOutlineSettings } from 'react-icons/md';
import { sensors, historicalData, currentWaterQuality } from '../data/dummyData';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';

const SensorDetail = () => {
  const { id } = useParams();
  const [sensor, setSensor] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulasi pengambilan data sensor berdasarkan ID
    const sensorId = parseInt(id);
    const foundSensor = sensors.find(s => s.id === sensorId);
    
    if (foundSensor) {
      setSensor(foundSensor);
      
      // Cari data terkini untuk sensor ini
      const data = currentWaterQuality.find(d => d.sensorId === sensorId);
      setCurrentData(data);
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
        <p className="mt-2 text-gray-500">The sensor with ID {id} could not be found.</p>
        <Link to="/" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
          <MdArrowBack className="mr-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Mendapatkan data historis berdasarkan tipe sensor
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

  // Parameter settings berdasarkan tipe sensor
  const getParameterSettings = () => {
    switch (sensor.type) {
      case 'pH Sensor':
        return { 
          min: 0, 
          max: 14, 
          unit: '', 
          thresholds: { warning: 6.5, danger: 8.5 } 
        };
      case 'Temperature Sensor':
        return { 
          min: 0, 
          max: 50, 
          unit: '°C', 
          thresholds: { warning: 25, danger: 30 } 
        };
      case 'TDS Sensor':
        return { 
          min: 0, 
          max: 1000, 
          unit: 'ppm', 
          thresholds: { warning: 400, danger: 500 } 
        };
      case 'Turbidity Sensor':
        return { 
          min: 0, 
          max: 20, 
          unit: 'NTU', 
          thresholds: { warning: 5, danger: 10 } 
        };
      default:
        return { min: 0, max: 100, unit: '', thresholds: {} };
    }
  };

  const paramSettings = getParameterSettings();
  const historicalDataForSensor = getHistoricalDataByType();

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <MdArrowBack className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{sensor.type}</h2>
          <p className="text-gray-500">{sensor.location}</p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
        <div className={`h-3 w-3 rounded-full ${
          sensor.status === 'active' ? 'bg-success-500' : 'bg-gray-300'
        }`} />
        <span className="ml-2 text-gray-700">
          Status: <span className="font-medium">{sensor.status === 'active' ? 'Active' : 'Inactive'}</span>
        </span>
        <span className="mx-4 text-gray-300">|</span>
        <span className="text-gray-700">
          Last Reading: <span className="font-medium">
            {new Date(sensor.lastReading).toLocaleString()}
          </span>
        </span>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center">
              <MdOutlineHistory className="mr-1" />
              History
            </div>
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <div className="flex items-center">
              <MdOutlineSettings className="mr-1" />
              Settings
            </div>
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Reading</h3>
            
            {currentData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current value card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-500 mb-1">Current Value</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {currentData.value}
                    <span className="text-lg font-normal text-gray-500 ml-1">
                      {currentData.unit}
                    </span>
                  </div>
                  
                  <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentData.status === 'normal'
                      ? 'bg-success-100 text-success-800'
                      : currentData.status === 'warning'
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {currentData.status.toUpperCase()}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <div className="flex justify-between mb-1">
                      <span>Min: {currentData.threshold.min}{currentData.unit}</span>
                      <span>Max: {currentData.threshold.max}{currentData.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentData.status === 'normal'
                            ? 'bg-success-500'
                            : currentData.status === 'warning'
                            ? 'bg-warning-500'
                            : 'bg-danger-500'
                        }`}
                        style={{ 
                          width: `${(currentData.value - paramSettings.min) / (paramSettings.max - paramSettings.min) * 100}%` 
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
                    thresholds={paramSettings.thresholds}
                    unit={currentData.unit}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No current data available for this sensor.</div>
            )}

            {/* Recent history chart */}
            {historicalDataForSensor.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent History</h3>
                <LineChart 
                  data={historicalDataForSensor.slice(-8)} // Show last 8 readings
                  dataKey="value"
                  name={sensor.type.split(' ')[0]} // Extract parameter name (e.g., "pH" from "pH Sensor")
                  unit={paramSettings.unit}
                  color="#0ea5e9"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Data</h3>
            
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
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicalDataForSensor.map((data, idx) => {
                        // Simple status calculation for demo
                        let status = 'normal';
                        if (paramSettings.thresholds) {
                          if (data.value >= paramSettings.thresholds.danger) status = 'danger';
                          else if (data.value >= paramSettings.thresholds.warning) status = 'warning';
                        }
                        
                        return (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(data.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {data.value} {paramSettings.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                status === 'normal'
                                  ? 'bg-success-100 text-success-800'
                                  : status === 'warning'
                                  ? 'bg-warning-100 text-warning-800'
                                  : 'bg-danger-100 text-danger-800'
                              }`}>
                                {status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No historical data available for this sensor.</div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sensor Settings</h3>
            
            <div className="space-y-6">
              {/* Sensor Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Sensor Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Sensor ID</div>
                      <div className="text-sm font-medium">{sensor.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-sm font-medium">{sensor.type}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-sm font-medium">{sensor.location}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Description</div>
                    <div className="text-sm">{sensor.description}</div>
                  </div>
                </div>
              </div>
              
              {/* Threshold Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Threshold Settings
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="min-threshold" className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Threshold
                        </label>
                        <input
                          type="number"
                          id="min-threshold"
                          className="form-input"
                          placeholder="Min value"
                          defaultValue={currentData?.threshold.min}
                        />
                      </div>
                      <div>
                        <label htmlFor="max-threshold" className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Threshold
                        </label>
                        <input
                          type="number"
                          id="max-threshold"
                          className="form-input"
                          placeholder="Max value"
                          defaultValue={currentData?.threshold.max}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Notification Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Notification Settings
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Email Notifications</div>
                        <div className="text-sm text-gray-500">Receive email alerts when thresholds are exceeded</div>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="email-toggle"
                          className="sr-only"
                          defaultChecked
                        />
                        <label
                          htmlFor="email-toggle"
                          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        >
                          <span
                            className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"
                          ></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">SMS Notifications</div>
                        <div className="text-sm text-gray-500">Receive SMS alerts when thresholds are exceeded</div>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="sms-toggle"
                          className="sr-only"
                        />
                        <label
                          htmlFor="sms-toggle"
                          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        >
                          <span
                            className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
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
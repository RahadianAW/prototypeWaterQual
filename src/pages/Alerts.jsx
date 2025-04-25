// src/pages/Alerts.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdWarning, 
  MdCheckCircle, 
  MdFilterList, 
  MdOutlineWaterDrop, 
  MdOutlineDeviceThermostat,
  MdOutlineOpacity
} from 'react-icons/md';
import { alerts, sensors } from '../data/dummyData';
import { format, parseISO } from 'date-fns';

const Alerts = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'resolved'
  const [parameterFilter, setParameterFilter] = useState('all'); // 'all', 'pH', 'Temperature', 'TDS', 'Turbidity'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Menerapkan filter
  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === 'all' || alert.status === filter;
    const parameterMatch = parameterFilter === 'all' || alert.parameter === parameterFilter;
    return statusMatch && parameterMatch;
  });

  // Mendapatkan icon berdasarkan parameter
  const getParameterIcon = (parameter) => {
    switch (parameter) {
      case 'pH':
        return <MdOutlineWaterDrop className="h-5 w-5" />;
      case 'Temperature':
        return <MdOutlineDeviceThermostat className="h-5 w-5" />;
      case 'TDS':
        return <MdOutlineWaterDrop className="h-5 w-5" />;
      case 'Turbidity':
        return <MdOutlineOpacity className="h-5 w-5" />;
      default:
        return <MdWarning className="h-5 w-5" />;
    }
  };

  // Mendapatkan nama lokasi dari sensor ID
  const getLocationName = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? sensor.location : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Alerts</h2>
        
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <MdFilterList className="mr-2 h-5 w-5 text-gray-400" />
            Filter
          </button>
          
          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 font-medium">Status</div>
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-4 py-2 text-sm ${filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`w-full text-left px-4 py-2 text-sm ${filter === 'active' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('resolved')}
                  className={`w-full text-left px-4 py-2 text-sm ${filter === 'resolved' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Resolved
                </button>
              </div>
              
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 font-medium">Parameter</div>
                <button
                  onClick={() => setParameterFilter('all')}
                  className={`w-full text-left px-4 py-2 text-sm ${parameterFilter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  All Parameters
                </button>
                <button
                  onClick={() => setParameterFilter('pH')}
                  className={`w-full text-left px-4 py-2 text-sm ${parameterFilter === 'pH' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  pH
                </button>
                <button
                  onClick={() => setParameterFilter('Temperature')}
                  className={`w-full text-left px-4 py-2 text-sm ${parameterFilter === 'Temperature' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Temperature
                </button>
                <button
                  onClick={() => setParameterFilter('TDS')}
                  className={`w-full text-left px-4 py-2 text-sm ${parameterFilter === 'TDS' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  TDS
                </button>
                <button
                  onClick={() => setParameterFilter('Turbidity')}
                  className={`w-full text-left px-4 py-2 text-sm ${parameterFilter === 'Turbidity' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Turbidity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Count Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-primary-50 p-3">
              <MdWarning className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Alerts</h3>
              <p className="text-lg font-semibold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-warning-50 p-3">
              <MdWarning className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
              <p className="text-lg font-semibold text-gray-900">
                {alerts.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-success-50 p-3">
              <MdCheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Resolved Alerts</h3>
              <p className="text-lg font-semibold text-gray-900">
                {alerts.filter(a => a.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Alert List</h3>
          <p className="mt-1 text-sm text-gray-500">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </p>
        </div>
        
        {filteredAlerts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-full ${
                      alert.status === 'active'
                        ? alert.parameter === 'Turbidity'
                          ? 'bg-danger-100 text-danger-600'
                          : 'bg-warning-100 text-warning-600'
                        : 'bg-success-100 text-success-600'
                    }`}>
                      {alert.status === 'active' ? getParameterIcon(alert.parameter) : <MdCheckCircle className="h-5 w-5" />}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-medium text-gray-900">{alert.parameter} Alert</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'active'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-success-100 text-success-800'
                      }`}>
                        {alert.status === 'active' ? 'Active' : 'Resolved'}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="mr-4">Value: {alert.value}</span>
                      <span>Threshold: {alert.threshold}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>{getLocationName(alert.sensorId)}</span>
                      <span className="mx-1">•</span>
                      <span>{format(parseISO(alert.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <Link 
                      to={`/sensors/${alert.sensorId}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View Sensor
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No alerts found with the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
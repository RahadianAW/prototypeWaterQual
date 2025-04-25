// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  sensors, 
  currentWaterQuality, 
  historicalData, 
  alerts 
} from '../data/dummyData';

import StatsOverview from '../components/dashboard/StatsOverview';
import SensorStatus from '../components/dashboard/SensorStatus';
import ParameterChart from '../components/dashboard/ParameterChart';
import AlertCard from '../components/dashboard/AlertCard';

const Dashboard = () => {
  // Filter alert aktif saja
  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview waterQualityData={currentWaterQuality} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts - 2 columns pada layar besar */}
        <div className="lg:col-span-2 space-y-6">
          {/* pH Chart */}
          <ParameterChart 
            title="pH Level" 
            data={historicalData.ph} 
            color="#0ea5e9" 
            unit="" 
            thresholds={currentWaterQuality.find(i => i.parameter === 'pH').threshold}
          />
          
          {/* Temperature Chart */}
          <ParameterChart 
            title="Temperature" 
            data={historicalData.temperature} 
            color="#ef4444" 
            unit="°C" 
            thresholds={currentWaterQuality.find(i => i.parameter === 'Temperature').threshold}
          />
          
          {/* TDS Chart */}
          <ParameterChart 
            title="TDS" 
            data={historicalData.tds} 
            color="#14b8a6" 
            unit="ppm" 
            thresholds={currentWaterQuality.find(i => i.parameter === 'TDS').threshold}
          />
          
          {/* Turbidity Chart */}
          <ParameterChart 
            title="Turbidity" 
            data={historicalData.turbidity} 
            color="#f59e0b" 
            unit="NTU" 
            thresholds={currentWaterQuality.find(i => i.parameter === 'Turbidity').threshold}
          />
        </div>
        
        {/* Side Panel - 1 column */}
        <div className="space-y-6">
          {/* Sensor Status */}
          <SensorStatus sensors={sensors} />
          
          {/* Active Alerts */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Active Alerts</h3>
            </div>
            <div className="p-4">
              {activeAlerts.length > 0 ? (
                <div className="space-y-4">
                  {activeAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No active alerts</p>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <Link 
                to="/alerts"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// src/components/dashboard/ParameterChart.jsx
import React, { useState } from 'react';
import LineChart from '../charts/LineChart';
import { 
  MdOutlineCalendarToday, 
  MdOutlineCalendarMonth, 
  MdDateRange // Pengganti MdOutlineCalendarWeek yang tidak tersedia
} from 'react-icons/md';

const ParameterChart = ({ title, data, dataKey = 'value', unit, color, thresholds }) => {
  const [timeRange, setTimeRange] = useState('day');
  
  // Berdasarkan timeRange, filter data yang akan ditampilkan
  // Dalam contoh ini, semua data digunakan karena data dummy terbatas
  const filteredData = data;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        
        <div className="flex space-x-1">
          <button
            className={`p-1.5 rounded-md ${
              timeRange === 'day' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setTimeRange('day')}
            title="Daily"
          >
            <MdOutlineCalendarToday className="h-5 w-5" />
          </button>
          <button
            className={`p-1.5 rounded-md ${
              timeRange === 'week' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setTimeRange('week')}
            title="Weekly"
          >
            <MdDateRange className="h-5 w-5" /> {/* Diganti dari MdOutlineCalendarWeek */}
          </button>
          <button
            className={`p-1.5 rounded-md ${
              timeRange === 'month' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setTimeRange('month')}
            title="Monthly"
          >
            <MdOutlineCalendarMonth className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <LineChart 
          data={filteredData} 
          dataKey={dataKey} 
          name={title} 
          color={color} 
          unit={unit} 
        />
        
        {thresholds && (
          <div className="mt-2 flex justify-end space-x-4 text-xs">
            {thresholds.min !== undefined && (
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-warning-500 mr-1"></span>
                <span className="text-gray-500">Min: {thresholds.min}{unit}</span>
              </div>
            )}
            {thresholds.max !== undefined && (
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-danger-500 mr-1"></span>
                <span className="text-gray-500">Max: {thresholds.max}{unit}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParameterChart;
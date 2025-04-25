// src/pages/Reports.jsx
import React, { useState } from 'react';
import { MdDownload, MdCalendarToday, MdLocationOn } from 'react-icons/md';
import { historicalData, sensors } from '../data/dummyData';
import { format, parseISO, subDays } from 'date-fns';
import LineChart from '../components/charts/LineChart';

const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedParams, setSelectedParams] = useState({
    ph: true,
    temperature: true,
    tds: true,
    turbidity: true
  });

  // Mendapatkan daftar lokasi unik dari data sensor
  const locations = [...new Set(sensors.map(sensor => sensor.location))];

  // Filter data berdasarkan tanggal
  const getFilteredDataByDate = (data) => {
    const now = new Date();
    
    switch (dateRange) {
      case 'today':
        return data.filter(item => {
          const date = parseISO(item.timestamp);
          return format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        });
      case '7days':
        return data.filter(item => {
          const date = parseISO(item.timestamp);
          return date >= subDays(now, 7);
        });
      case '30days':
        return data.filter(item => {
          const date = parseISO(item.timestamp);
          return date >= subDays(now, 30);
        });
      default:
        return data;
    }
  };

  // Filter data berdasarkan lokasi
  // Dalam contoh ini, kita hanya mensimulasikan filter lokasi
  // karena data dummy tidak memiliki informasi lokasi
  const getFilteredData = () => {
    // Untuk demo ini, kita menganggap semua data berasal dari lokasi yang sama
    if (selectedLocation === 'all') {
      return {
        ph: getFilteredDataByDate(historicalData.ph),
        temperature: getFilteredDataByDate(historicalData.temperature),
        tds: getFilteredDataByDate(historicalData.tds),
        turbidity: getFilteredDataByDate(historicalData.turbidity)
      };
    }
    
    // Dalam kasus nyata, ini akan memfilter berdasarkan lokasi
    return {
      ph: getFilteredDataByDate(historicalData.ph),
      temperature: getFilteredDataByDate(historicalData.temperature),
      tds: getFilteredDataByDate(historicalData.tds),
      turbidity: getFilteredDataByDate(historicalData.turbidity)
    };
  };

  const filteredData = getFilteredData();

  // Fungsi untuk mensimulasikan ekspor data
  const exportData = (format) => {
    const params = [];
    if (selectedParams.ph) params.push('pH');
    if (selectedParams.temperature) params.push('Temperature');
    if (selectedParams.tds) params.push('TDS');
    if (selectedParams.turbidity) params.push('Turbidity');
    
    alert(`Exporting ${params.join(', ')} data to ${format.toUpperCase()} for ${selectedLocation} location, time range: ${dateRange}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdCalendarToday className="inline-block mr-1" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-input"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdLocationOn className="inline-block mr-1" />
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-input"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Parameters */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parameters
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedParams.ph}
                  onChange={() => setSelectedParams({
                    ...selectedParams,
                    ph: !selectedParams.ph
                  })}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">pH</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedParams.temperature}
                  onChange={() => setSelectedParams({
                    ...selectedParams,
                    temperature: !selectedParams.temperature
                  })}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Temperature</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedParams.tds}
                  onChange={() => setSelectedParams({
                    ...selectedParams,
                    tds: !selectedParams.tds
                  })}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">TDS</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedParams.turbidity}
                  onChange={() => setSelectedParams({
                    ...selectedParams,
                    turbidity: !selectedParams.turbidity
                  })}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Turbidity</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Report</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => exportData('csv')}
            className="btn btn-primary flex items-center"
          >
            <MdDownload className="mr-2" />
            Export CSV
          </button>
          
          <button
            onClick={() => exportData('pdf')}
            className="btn btn-secondary flex items-center"
          >
            <MdDownload className="mr-2" />
            Export PDF
          </button>
          
          <button
            onClick={() => exportData('excel')}
            className="bg-green-600 hover:bg-green-700 text-white btn flex items-center"
          >
            <MdDownload className="mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Data Visualization */}
      <div className="space-y-6">
        {/* pH Chart */}
        {selectedParams.ph && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">pH Level</h3>
            <LineChart 
              data={filteredData.ph} 
              dataKey="value" 
              name="pH" 
              color="#0ea5e9" 
              unit="" 
            />
          </div>
        )}
        
        {/* Temperature Chart */}
        {selectedParams.temperature && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temperature</h3>
            <LineChart 
              data={filteredData.temperature} 
              dataKey="value" 
              name="Temperature" 
              color="#ef4444" 
              unit="°C" 
            />
          </div>
        )}
        
        {/* TDS Chart */}
        {selectedParams.tds && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">TDS (Total Dissolved Solids)</h3>
            <LineChart 
              data={filteredData.tds} 
              dataKey="value" 
              name="TDS" 
              color="#14b8a6" 
              unit="ppm" 
            />
          </div>
        )}
        
        {/* Turbidity Chart */}
        {selectedParams.turbidity && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Turbidity</h3>
            <LineChart 
              data={filteredData.turbidity} 
              dataKey="value" 
              name="Turbidity" 
              color="#f59e0b" 
              unit="NTU" 
            />
          </div>
        )}
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Summary Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Statistical summary of water quality parameters
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Minimum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maximum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Reading
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* pH Row */}
              {selectedParams.ph && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    pH Level
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.ph.length > 0
                      ? (filteredData.ph.reduce((acc, item) => acc + item.value, 0) / filteredData.ph.length).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.ph.length > 0
                      ? Math.min(...filteredData.ph.map(item => item.value)).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.ph.length > 0
                      ? Math.max(...filteredData.ph.map(item => item.value)).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.ph.length > 0
                      ? filteredData.ph[filteredData.ph.length - 1].value.toFixed(2)
                      : 'N/A'}
                  </td>
                </tr>
              )}
              
              {/* Temperature Row */}
              {selectedParams.temperature && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Temperature
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.temperature.length > 0
                      ? (filteredData.temperature.reduce((acc, item) => acc + item.value, 0) / filteredData.temperature.length).toFixed(2) + ' °C'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.temperature.length > 0
                      ? Math.min(...filteredData.temperature.map(item => item.value)).toFixed(2) + ' °C'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.temperature.length > 0
                      ? Math.max(...filteredData.temperature.map(item => item.value)).toFixed(2) + ' °C'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.temperature.length > 0
                      ? filteredData.temperature[filteredData.temperature.length - 1].value.toFixed(2) + ' °C'
                      : 'N/A'}
                  </td>
                </tr>
              )}
              
              {/* TDS Row */}
              {selectedParams.tds && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    TDS
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.tds.length > 0
                      ? (filteredData.tds.reduce((acc, item) => acc + item.value, 0) / filteredData.tds.length).toFixed(2) + ' ppm'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.tds.length > 0
                      ? Math.min(...filteredData.tds.map(item => item.value)).toFixed(2) + ' ppm'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.tds.length > 0
                      ? Math.max(...filteredData.tds.map(item => item.value)).toFixed(2) + ' ppm'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.tds.length > 0
                      ? filteredData.tds[filteredData.tds.length - 1].value.toFixed(2) + ' ppm'
                      : 'N/A'}
                  </td>
                </tr>
              )}
              
              {/* Turbidity Row */}
              {selectedParams.turbidity && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Turbidity
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.turbidity.length > 0
                      ? (filteredData.turbidity.reduce((acc, item) => acc + item.value, 0) / filteredData.turbidity.length).toFixed(2) + ' NTU'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.turbidity.length > 0
                      ? Math.min(...filteredData.turbidity.map(item => item.value)).toFixed(2) + ' NTU'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.turbidity.length > 0
                      ? Math.max(...filteredData.turbidity.map(item => item.value)).toFixed(2) + ' NTU'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {filteredData.turbidity.length > 0
                      ? filteredData.turbidity[filteredData.turbidity.length - 1].value.toFixed(2) + ' NTU'
                      : 'N/A'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
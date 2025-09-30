// src/pages/Reports.jsx
import React, { useState } from 'react';
import { MdDownload, MdCalendarToday, MdLocationOn } from 'react-icons/md';
import { historicalData, sensors } from '../data/dummyData';
import { format, parseISO, subDays } from 'date-fns';
import LineChart from '../components/charts/LineChart';

const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Buat state parameter otomatis dari historicalData
  const [selectedParams, setSelectedParams] = useState(
    Object.keys(historicalData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  // Daftar lokasi unik dari sensors
  const locations = [...new Set(sensors.map((sensor) => sensor.location))];

  // Filter berdasarkan tanggal
  const getFilteredDataByDate = (data) => {
    const now = new Date();
    return data.filter((item) => {
      const date = parseISO(item.timestamp);
      if (dateRange === 'today') {
        return format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
      } else if (dateRange === '7days') {
        return date >= subDays(now, 7);
      } else if (dateRange === '30days') {
        return date >= subDays(now, 30);
      }
      return true; // all time
    });
  };

  // Filter berdasarkan lokasi + tanggal
  const getFilteredData = () => {
    return Object.keys(historicalData).reduce((acc, param) => {
      let data = getFilteredDataByDate(historicalData[param]);

      if (selectedLocation !== 'all') {
        data = data.filter((item) => item.location === selectedLocation);
      }

      acc[param] = data;
      return acc;
    }, {});
  };

  const filteredData = getFilteredData();

  // Ekspor data (simulasi)
  const exportData = (format) => {
    const params = Object.keys(selectedParams).filter((p) => selectedParams[p]);
    alert(
      `Exporting ${params.join(', ')} data to ${format.toUpperCase()} for ${
        selectedLocation
      } location, time range: ${dateRange}`
    );
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
              {locations.map((location) => (
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
              {Object.keys(selectedParams).map((param) => (
                <label key={param} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedParams[param]}
                    onChange={() =>
                      setSelectedParams({
                        ...selectedParams,
                        [param]: !selectedParams[param],
                      })
                    }
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {param}
                  </span>
                </label>
              ))}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(selectedParams).map(
          (param) =>
            selectedParams[param] &&
            [...new Set(filteredData[param]?.map((d) => d.location))].map(
              (loc) => (
                <div
                  key={`${param}-${loc}`}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {param} ({loc})
                  </h3>
                  <LineChart
                    data={filteredData[param].filter((d) => d.location === loc)}
                    dataKey="value"
                    name={`${param} - ${loc}`}
                    color="#0ea5e9"
                    unit=""
                  />
                </div>
              )
            )
        )}
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Summary Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Statistical summary of water quality parameters by location
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Minimum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Maximum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Reading
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(selectedParams).map(
                (param) =>
                  selectedParams[param] &&
                  [...new Set(filteredData[param]?.map((d) => d.location))].map(
                    (loc) => {
                      const rows = filteredData[param].filter(
                        (d) => d.location === loc
                      );
                      return (
                        <tr key={`${param}-${loc}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {param}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rows.length > 0
                              ? (
                                  rows.reduce(
                                    (acc, item) => acc + item.value,
                                    0
                                  ) / rows.length
                                ).toFixed(2)
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rows.length > 0
                              ? Math.min(...rows.map((item) => item.value)).toFixed(2)
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rows.length > 0
                              ? Math.max(...rows.map((item) => item.value)).toFixed(2)
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rows.length > 0
                              ? rows[rows.length - 1].value.toFixed(2)
                              : 'N/A'}
                          </td>
                        </tr>
                      );
                    }
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

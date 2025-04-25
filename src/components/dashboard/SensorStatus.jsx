// src/components/dashboard/SensorStatus.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MdCircle, MdOutlineArrowForward } from 'react-icons/md';
import { format, parseISO } from 'date-fns';

const SensorStatus = ({ sensors }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Sensor Status</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                    sensor.status === 'active' ? 'bg-success-500' : 'bg-gray-300'
                  }`} />
                  <h4 className="font-medium text-gray-900">{sensor.type}</h4>
                </div>
                <p className="mt-1 text-sm text-gray-500">{sensor.location}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Last Reading: {format(parseISO(sensor.lastReading), 'dd MMM yyyy, HH:mm')}
                </p>
              </div>
              <Link 
                to={`/sensors/${sensor.id}`} 
                className="text-primary-600 hover:text-primary-700"
              >
                <MdOutlineArrowForward className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <Link 
          to="/sensors"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all sensors
        </Link>
      </div>
    </div>
  );
};

export default SensorStatus;
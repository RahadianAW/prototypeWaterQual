// src/components/dashboard/DataCard.jsx
import React from 'react';

const DataCard = ({ title, value, unit, status, icon }) => {
  // Menentukan warna berdasarkan status
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'warning':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'danger':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`rounded-lg border ${getStatusColor()} p-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {unit && <p className="ml-1 text-sm text-gray-500">{unit}</p>}
          </div>
        </div>
        {icon && <div className="text-2xl text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

export default DataCard;
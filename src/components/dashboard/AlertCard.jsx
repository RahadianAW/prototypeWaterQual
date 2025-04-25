// src/components/dashboard/AlertCard.jsx
import React from 'react';
import { MdWarning, MdCheckCircle } from 'react-icons/md';
import { format, parseISO } from 'date-fns';

const AlertCard = ({ alert }) => {
  const { parameter, value, threshold, timestamp, status, message } = alert;
  
  // Format timestamp
  const formattedTime = format(parseISO(timestamp), 'dd MMM yyyy, HH:mm');
  
  // Background colors based on parameter type
  const getBgColor = () => {
    if (status === 'resolved') return 'bg-success-50 border-success-200';
    
    switch (parameter) {
      case 'pH':
        return 'bg-warning-50 border-warning-200';
      case 'Temperature':
        return 'bg-warning-50 border-warning-200';
      case 'TDS':
        return 'bg-warning-50 border-warning-200';
      case 'Turbidity':
        return 'bg-danger-50 border-danger-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  // Status indicator and colors
  const getStatusIndicator = () => {
    if (status === 'resolved') {
      return {
        icon: <MdCheckCircle className="h-5 w-5 text-success-500" />,
        text: 'Resolved'
      };
    }
    return {
      icon: <MdWarning className="h-5 w-5 text-warning-500" />,
      text: 'Active'
    };
  };
  
  const statusIndicator = getStatusIndicator();

  return (
    <div className={`rounded-lg border ${getBgColor()} p-4 mb-4`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">{parameter} Alert</h3>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              status === 'resolved' 
                ? 'bg-success-100 text-success-800' 
                : 'bg-warning-100 text-warning-800'
            }`}>
              {statusIndicator.text}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mr-4">Value: {value}</span>
            <span>Threshold: {threshold}</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {formattedTime}
          </div>
        </div>
        <div>
          {statusIndicator.icon}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
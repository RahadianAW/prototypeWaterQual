// src/components/ui/LoadingSkeleton.jsx
import React from "react";

/**
 * Skeleton Loader Component untuk Data Loading
 * @param {string} type - 'card', 'list', 'text', 'table'
 * @param {number} count - Number of skeleton items
 * @param {string} className - Additional custom classes
 */
const LoadingSkeleton = ({ type = "card", count = 1, className = "" }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === "card") {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="flex items-start space-x-4">
              {/* Icon placeholder */}
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-lg"></div>

              <div className="flex-1 space-y-3">
                {/* Title */}
                <div className="h-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-3/4"></div>
                {/* Subtitle */}
                <div className="h-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-1/2"></div>
                {/* Content */}
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded"></div>
                  <div className="h-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg animate-pulse"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-3/4"></div>
              <div className="h-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        {items.map((i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded animate-pulse"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          ></div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      >
        <div className="animate-pulse">
          {/* Table header */}
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-4">
            <div className="flex space-x-4">
              <div className="h-4 bg-cyan-300 rounded w-1/4"></div>
              <div className="h-4 bg-cyan-300 rounded w-1/4"></div>
              <div className="h-4 bg-cyan-300 rounded w-1/4"></div>
              <div className="h-4 bg-cyan-300 rounded w-1/4"></div>
            </div>
          </div>

          {/* Table rows */}
          {items.map((i) => (
            <div key={i} className="border-t border-gray-100 px-6 py-4">
              <div className="flex space-x-4">
                <div className="h-3 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-1/4"></div>
                <div className="h-3 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-1/4"></div>
                <div className="h-3 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-1/4"></div>
                <div className="h-3 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;

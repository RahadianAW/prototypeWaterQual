// src/components/ui/Spinner.jsx
import React from "react";

/**
 * Reusable Spinner Component
 * @param {string} size - 'sm', 'md', 'lg', 'xl'
 * @param {string} color - 'cyan', 'blue', 'red', 'green', 'yellow'
 * @param {string} className - Additional custom classes
 */
const Spinner = ({ size = "md", color = "cyan", className = "" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  const colorClasses = {
    cyan: "border-cyan-200 border-t-cyan-600",
    blue: "border-blue-200 border-t-blue-600",
    red: "border-red-200 border-t-red-600",
    green: "border-green-200 border-t-green-600",
    yellow: "border-yellow-200 border-t-yellow-600",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;

// src/components/ui/Select.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  label,
  error,
  disabled = false,
  size = "md",
  className = "",
  icon: Icon,
}) => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Icon di kiri (opsional) */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <Icon className={iconSizes[size]} />
          </div>
        )}

        {/* Select Element */}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full rounded-lg border-2 bg-white
            font-medium appearance-none cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
            ${Icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-200 hover:border-gray-300"
            }
            ${sizes[size]}
          `
            .trim()
            .replace(/\s+/g, " ")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon di kanan */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className={iconSizes[size]} />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;

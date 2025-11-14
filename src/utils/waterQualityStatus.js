/**
 * Water Quality Parameter Status Utility
 * Determines individual parameter status based on value and threshold
 */

/**
 * Get status for individual water quality parameter
 * @param {string} paramKey - Parameter key (ph, temperature, tds, turbidity)
 * @param {number} value - Parameter value
 * @param {string} location - Location (inlet or outlet)
 * @returns {string|null} Status (Excellent, Good, Fair, Poor, Very Poor)
 */
export const getParameterStatus = (paramKey, value, location = "outlet") => {
  if (value === null || value === undefined) return null;

  switch (paramKey) {
    case "ph":
      if (value < 6.0 || value > 9.0) return "Very Poor";
      if (value < 6.5 || value > 8.5) return "Poor";
      if (value >= 6.5 && value <= 8.5) return "Excellent";
      return "Good";

    case "temperature":
      if (value < 20 || value > 38) return "Poor";
      if (value > 35) return "Fair";
      if (value >= 20 && value <= 30) return "Excellent";
      return "Good";

    case "tds":
      const tdsThreshold = location === "outlet" ? 1000 : 2000;
      if (value > tdsThreshold * 1.2) return "Very Poor";
      if (value > tdsThreshold) return "Poor";
      if (value <= tdsThreshold * 0.5) return "Excellent";
      if (value <= tdsThreshold * 0.75) return "Good";
      return "Fair";

    case "turbidity":
      const turbidityThreshold = location === "outlet" ? 25 : 400;
      if (value > turbidityThreshold * 1.5) return "Very Poor";
      if (value > turbidityThreshold) return "Poor";
      if (value <= turbidityThreshold * 0.3) return "Excellent";
      if (value <= turbidityThreshold * 0.6) return "Good";
      return "Fair";

    default:
      return null;
  }
};

/**
 * Get status color classes for UI components
 * @param {string} status - Status string
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  if (!status) return "bg-gray-100 text-gray-700 border-gray-300";

  const statusMap = {
    Excellent: "bg-emerald-50 text-emerald-700 border-emerald-300",
    Good: "bg-green-50 text-green-700 border-green-300",
    Fair: "bg-yellow-50 text-yellow-700 border-yellow-300",
    Poor: "bg-orange-50 text-orange-700 border-orange-300",
    "Very Poor": "bg-red-50 text-red-700 border-red-300",
  };

  return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-300";
};

/**
 * Get status badge color classes
 * @param {string} status - Status string
 * @returns {object} Badge color configuration
 */
export const getStatusBadgeColor = (status) => {
  const colorMap = {
    Excellent: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
    },
    Good: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    Fair: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    Poor: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
    },
    "Very Poor": {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  return (
    colorMap[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    }
  );
};

/**
 * Get all parameters with their status
 * @param {object} data - Parameter data object
 * @param {string} location - Location (inlet or outlet)
 * @returns {array} Array of parameters with status
 */
export const getAllParametersStatus = (data, location = "outlet") => {
  const parameters = ["ph", "temperature", "tds", "turbidity"];

  return parameters.map((param) => ({
    key: param,
    value: data?.[param],
    status: getParameterStatus(param, data?.[param], location),
  }));
};

/**
 * Get parameter unit
 * @param {string} parameter - Parameter name (ph/tds/turbidity/temperature)
 * @returns {string} Unit string
 */
export const getParameterUnit = (parameter) => {
  const units = {
    ph: "",
    tds: "ppm",
    turbidity: "NTU",
    temperature: "°C",
  };

  return units[parameter?.toLowerCase()] || "";
};

/**
 * Get parameter name (display name)
 * @param {string} parameter - Parameter name
 * @returns {string} Formatted parameter name
 */
export const getParameterName = (parameter) => {
  const names = {
    ph: "pH Level",
    tds: "TDS",
    turbidity: "Turbidity",
    temperature: "Temperature",
  };

  return names[parameter?.toLowerCase()] || parameter;
};

/**
 * Format parameter value with unit
 * @param {number} value - Parameter value
 * @param {string} parameter - Parameter name
 * @returns {string} Formatted value with unit
 */
export const formatParameterValue = (value, parameter) => {
  if (value === null || value === undefined) return "-";

  const unit = getParameterUnit(parameter);
  const formattedValue = typeof value === "number" ? value.toFixed(2) : value;

  return `${formattedValue} ${unit}`.trim();
};

/**
 * Get baku mutu (threshold) for parameter
 * @param {string} parameter - Parameter name
 * @param {string} location - inlet or outlet
 * @returns {Object} Threshold object { min, max }
 */
export const getBakuMutu = (parameter, location = "outlet") => {
  const thresholds = {
    outlet: {
      ph: { min: 6.0, max: 9.0 },
      tds: { min: 0, max: 1000 },
      turbidity: { min: 0, max: 25 },
      temperature: { min: 20, max: 35 },
    },
    inlet: {
      ph: { min: 6.0, max: 9.0 },
      tds: { min: 0, max: 2000 },
      turbidity: { min: 0, max: 400 },
      temperature: { min: 20, max: 40 },
    },
  };

  const paramLower = parameter?.toLowerCase();
  return thresholds[location]?.[paramLower] || { min: 0, max: 100 };
};

/**
 * Check if parameter value is within threshold
 * @param {number} value - Parameter value
 * @param {string} parameter - Parameter name
 * @param {string} location - inlet or outlet
 * @returns {boolean} True if within threshold
 */
export const isWithinThreshold = (value, parameter, location = "outlet") => {
  if (value === null || value === undefined) return false;

  const threshold = getBakuMutu(parameter, location);
  return value >= threshold.min && value <= threshold.max;
};

/**
 * Format timestamp to Indonesian format
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted datetime
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";

  try {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
};

/**
 * Format date for chart labels
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time (HH:mm)
 */
export const formatChartTime = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
};

/**
 * Calculate efficiency percentage (inlet vs outlet)
 * @param {number} inlet - Inlet value
 * @param {number} outlet - Outlet value
 * @returns {number} Efficiency percentage
 */
export const calculateEfficiency = (inlet, outlet) => {
  if (!inlet || !outlet || inlet === 0) return 0;

  const reduction = ((inlet - outlet) / inlet) * 100;
  return Math.max(0, Math.min(100, reduction));
};

/**
 * Get efficiency status
 * @param {number} efficiency - Efficiency percentage
 * @returns {Object} { status, color, label }
 */
export const getEfficiencyStatus = (efficiency) => {
  if (efficiency >= 80) {
    return {
      status: "excellent",
      color: "text-green-600",
      label: "Excellent",
    };
  } else if (efficiency >= 60) {
    return {
      status: "good",
      color: "text-blue-600",
      label: "Good",
    };
  } else if (efficiency >= 40) {
    return {
      status: "fair",
      color: "text-yellow-600",
      label: "Fair",
    };
  } else if (efficiency >= 20) {
    return {
      status: "poor",
      color: "text-orange-600",
      label: "Poor",
    };
  } else {
    return {
      status: "very_poor",
      color: "text-red-600",
      label: "Very Poor",
    };
  }
};

/**
 * ========================================
 * WATER QUALITY HELPERS
 * ========================================
 * Lokasi: src/utils/waterQualityHelpers.js
 *
 * Helper functions untuk water quality:
 * - Status color mapping
 * - Parameter thresholds
 * - Formatting functions
 */

/**
 * Get status color class based on fuzzy logic status
 * @param {string} status - Status dari fuzzy logic (Sangat Baik/Baik/Cukup/Buruk/Sangat Buruk)
 * @returns {string} Tailwind CSS classes
 */
export const getStatusClass = (status) => {
  if (!status) return "bg-gray-100 text-gray-700";

  const statusLower = status.toLowerCase();

  if (statusLower.includes("sangat baik")) {
    return "bg-green-100 text-green-700 border-green-300";
  }

  if (statusLower.includes("baik")) {
    return "bg-blue-100 text-blue-700 border-blue-300";
  }

  if (statusLower.includes("cukup")) {
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  }

  if (statusLower.includes("buruk") && !statusLower.includes("sangat")) {
    return "bg-orange-100 text-orange-700 border-orange-300";
  }

  if (statusLower.includes("sangat buruk")) {
    return "bg-red-100 text-red-700 border-red-300";
  }

  return "bg-gray-100 text-gray-700 border-gray-300";
};

/**
 * Get status badge color
 * @param {string} status - Status string
 * @returns {string} Badge color class
 */
export const getStatusBadgeColor = (status) => {
  if (!status) return "bg-gray-500";

  const statusLower = status.toLowerCase();

  if (statusLower.includes("sangat baik")) return "bg-green-500";
  if (statusLower.includes("baik")) return "bg-blue-500";
  if (statusLower.includes("cukup")) return "bg-yellow-500";
  if (statusLower.includes("buruk") && !statusLower.includes("sangat"))
    return "bg-orange-500";
  if (statusLower.includes("sangat buruk")) return "bg-red-500";

  return "bg-gray-500";
};

/**
 * Format status text
 * @param {string} status - Status string
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1);
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
 * Get parameter name (capitalized)
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
 * Format parameter value dengan unit
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
 * Get baku mutu (threshold) untuk parameter
 * @param {string} parameter - Parameter name
 * @param {string} location - inlet or outlet
 * @returns {Object} Threshold object { min, max }
 */
export const getBakuMutu = (parameter, location = "outlet") => {
  // Baku mutu berdasarkan standar (sesuaikan dengan project Anda)
  const thresholds = {
    outlet: {
      ph: { min: 6.0, max: 9.0 },
      tds: { min: 0, max: 1000 }, // ppm
      turbidity: { min: 0, max: 25 }, // NTU
      temperature: { min: 20, max: 35 }, // °C (deviasi ±3°C dari suhu udara)
    },
    inlet: {
      // Inlet biasanya tidak ada baku mutu, tapi untuk referensi:
      ph: { min: 6.0, max: 9.0 },
      tds: { min: 0, max: 2000 },
      turbidity: { min: 0, max: 100 },
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
 * Format timestamp ke format Indonesia
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
 * Format date untuk chart labels
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
  return Math.max(0, Math.min(100, reduction)); // Clamp between 0-100
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
      label: "Sangat Baik",
    };
  } else if (efficiency >= 60) {
    return {
      status: "good",
      color: "text-blue-600",
      label: "Baik",
    };
  } else if (efficiency >= 40) {
    return {
      status: "fair",
      color: "text-yellow-600",
      label: "Cukup",
    };
  } else if (efficiency >= 20) {
    return {
      status: "poor",
      color: "text-orange-600",
      label: "Buruk",
    };
  } else {
    return {
      status: "very_poor",
      color: "text-red-600",
      label: "Sangat Buruk",
    };
  }
};

export default {
  getStatusClass,
  getStatusBadgeColor,
  formatStatus,
  getParameterUnit,
  getParameterName,
  formatParameterValue,
  getBakuMutu,
  isWithinThreshold,
  formatTimestamp,
  formatChartTime,
  calculateEfficiency,
  getEfficiencyStatus,
};

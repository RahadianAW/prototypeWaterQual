/**
 * ========================================
 * TimeRangeSelector Component
 * ========================================
 * UI component for time range selection
 *
 * FEATURES:
 * ✅ Quick presets (24h, 7d, 30d)
 * ✅ Custom date picker
 * ✅ Persistent selection
 */

import { useState } from "react";
import { useTimeRange, TIME_RANGES } from "../../hooks/useTimerange";

function TimeRangeSelector({
  defaultPreset = "7d",
  onChange,
  showCustom = true,
  storageKey = "timeRange",
}) {
  const {
    preset,
    startDate,
    endDate,
    setPreset,
    setCustomRange,
    TIME_RANGES: ranges,
  } = useTimeRange(defaultPreset, { storageKey });

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  // Handle preset selection
  const handlePresetClick = (presetKey) => {
    setPreset(presetKey);

    if (presetKey === "custom") {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      if (onChange) {
        // Calculate dates for the preset
        const end = new Date();
        const start = new Date();
        const config = ranges[presetKey];

        if (config.hours) {
          start.setHours(start.getHours() - config.hours);
        } else if (config.days) {
          start.setDate(start.getDate() - config.days);
        }

        onChange({
          preset: presetKey,
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        });
      }
    }
  };

  // Handle custom date apply
  const handleApplyCustom = () => {
    setCustomRange(tempStartDate, tempEndDate);
    setShowCustomPicker(false);

    if (onChange) {
      onChange({
        preset: "custom",
        startDate: tempStartDate,
        endDate: tempEndDate,
      });
    }
  };

  // Handle custom date cancel
  const handleCancelCustom = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowCustomPicker(false);
  };

  return (
    <div className="inline-block">
      {/* Preset buttons */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(ranges).map(([key, config]) => {
          // Skip custom if not shown
          if (key === "custom" && !showCustom) return null;

          return (
            <button
              key={key}
              onClick={() => handlePresetClick(key)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                preset === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Custom date picker modal/dropdown */}
      {showCustomPicker && (
        <div className="mt-3 p-4 bg-white border border-gray-300 rounded shadow-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelCustom}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCustom}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Current selection display (if custom) */}
      {preset === "custom" && !showCustomPicker && (
        <div className="mt-2 text-xs text-gray-600">
          {startDate} to {endDate}
        </div>
      )}
    </div>
  );
}

export default TimeRangeSelector;

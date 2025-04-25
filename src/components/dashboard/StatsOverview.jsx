// src/components/dashboard/StatsOverview.jsx
import React from 'react';
import DataCard from './DataCard';
import { 
  MdWaterDrop, 
  MdOutlineDeviceThermostat, 
  MdOutlineWaterDrop, 
  MdOutlineOpacity 
} from 'react-icons/md';

const StatsOverview = ({ waterQualityData }) => {
  // Map data untuk memudahkan akses
  const dataMap = waterQualityData.reduce((acc, item) => {
    acc[item.parameter.toLowerCase()] = item;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* pH Card */}
      {dataMap.ph && (
        <DataCard
          title="pH Level"
          value={dataMap.ph.value}
          unit={dataMap.ph.unit}
          status={dataMap.ph.status}
          icon={<MdWaterDrop />}
        />
      )}

      {/* Temperature Card */}
      {dataMap.temperature && (
        <DataCard
          title="Temperature"
          value={dataMap.temperature.value}
          unit={dataMap.temperature.unit}
          status={dataMap.temperature.status}
          icon={<MdOutlineDeviceThermostat />}
        />
      )}

      {/* TDS Card */}
      {dataMap.tds && (
        <DataCard
          title="TDS"
          value={dataMap.tds.value}
          unit={dataMap.tds.unit}
          status={dataMap.tds.status}
          icon={<MdOutlineWaterDrop />}
        />
      )}

      {/* Turbidity Card */}
      {dataMap.turbidity && (
        <DataCard
          title="Turbidity"
          value={dataMap.turbidity.value}
          unit={dataMap.turbidity.unit}
          status={dataMap.turbidity.status}
          icon={<MdOutlineOpacity />}
        />
      )}
    </div>
  );
};

export default StatsOverview;
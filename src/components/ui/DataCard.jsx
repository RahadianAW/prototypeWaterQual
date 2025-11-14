// src/components/ui/DataCard.jsx
import { getStatusColor } from "../../utils/waterQualityStatus";

const DataCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  isActive = true,
}) => {
  const statusColor = isActive
    ? getStatusColor(status)
    : "bg-gray-50 text-gray-400 border-gray-200";

  return (
    <div
      className={`${statusColor} rounded-xl p-5 border-2 transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {isActive && value !== null && value !== undefined
              ? `${value.toFixed(2)}${unit}`
              : "-"}
          </p>
          {isActive && status && (
            <p className="text-xs mt-2 opacity-80 font-semibold">{status}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-white bg-opacity-60 shadow-sm">
            <Icon className="w-8 h-8 stroke-[2.5]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;

// src/components/ui/DataCard.jsx
const DataCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  isActive = true,
}) => {
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-300";

    const statusMap = {
      "Sangat Baik": "bg-emerald-50 text-emerald-700 border-emerald-300",
      Baik: "bg-green-50 text-green-700 border-green-300",
      Sedang: "bg-yellow-50 text-yellow-700 border-yellow-300",
      Buruk: "bg-orange-50 text-orange-700 border-orange-300",
      "Sangat Buruk": "bg-red-50 text-red-700 border-red-300",
    };

    return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const statusColor = isActive
    ? getStatusColor(status)
    : "bg-gray-50 text-gray-400 border-gray-200";

  return (
    <div
      className={`${statusColor} rounded-xl p-5 border-2 transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {isActive && value !== null && value !== undefined
              ? `${value.toFixed(2)}${unit}`
              : "-"}
          </p>
          {isActive && status && (
            <p className="text-xs mt-2 opacity-75 font-medium">{status}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-white bg-opacity-50">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;

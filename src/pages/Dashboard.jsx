// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Droplet,
  Thermometer,
  Waves,
  Eye,
  RefreshCw,
  MapPin,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Components
import LineChart from "../components/charts/LineChart";
import StatsOverview from "../components/ui/StatsOverview";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import DataCard from "../components/ui/DataCard";

// Services
import dashboardService from "../services/dashboardService";
import sensorService from "../services/sensorServices";

// Helpers
import { formatChartTime } from "../utils/waterQualityHelpers";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to update map position when location changes
const MapUpdater = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 18, { duration: 1.2 });
    }
  }, [location, map]);
  return null;
};

const Dashboard = () => {
  const IPAL_ID = 1;

  // UI State
  const [selectedPlace, setSelectedPlace] = useState("");
  const [currentParamIndex, setCurrentParamIndex] = useState(0);

  // Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Locations (lat, lng)
  const locations = {
    inlet: [-7.050665024868658, 110.44008189915155],
    outlet: [-7.050193776750058, 110.44035712980384],
  };

  // Parameters configuration
  const parameters = [
    { name: "pH", key: "ph", unit: "", icon: Droplet, color: "#3b82f6" },
    {
      name: "Temperature",
      key: "temperature",
      unit: "°C",
      icon: Thermometer,
      color: "#ef4444",
    },
    { name: "TDS", key: "tds", unit: "ppm", icon: Waves, color: "#8b5cf6" },
    {
      name: "Turbidity",
      key: "turbidity",
      unit: "NTU",
      icon: Eye,
      color: "#f59e0b",
    },
  ];

  // Location dropdown options
  const locationOptions = [
    { value: "inlet", label: "🔵 Inlet (Air Masuk)" },
    { value: "outlet", label: "🟢 Outlet (Air Keluar)" },
  ];

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch historical data when location selected
  useEffect(() => {
    if (selectedPlace) {
      fetchHistoricalData();
    }
  }, [selectedPlace]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("📊 Fetching dashboard data for IPAL", IPAL_ID);
      const summary = await dashboardService.getSummary(IPAL_ID);
      console.log("✅ Dashboard data received:", summary);
      setDashboardData(summary);
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      console.log(`📈 Fetching historical data for ${selectedPlace}...`);
      const readings = await sensorService.getReadings({
        ipal_id: IPAL_ID,
        limit: 24,
        order: "asc",
      });
      console.log(`✅ Got ${readings.length} historical readings`);
      setHistoricalData(readings);
    } catch (err) {
      console.error("❌ Error fetching historical data:", err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    if (selectedPlace) {
      await fetchHistoricalData();
    }
    setIsRefreshing(false);
  };

  // Data processing
  const latestReading = dashboardData?.latest_reading;
  const currentData =
    selectedPlace && latestReading ? latestReading[selectedPlace] : null;
  const fuzzyStatus = latestReading?.fuzzy_analysis?.status || null;
  const qualityScore = latestReading?.fuzzy_analysis?.quality_score || 0;

  // Transform data for chart
  const currentParam = parameters[currentParamIndex];
  const chartData = historicalData
    .map((reading) => {
      const location = selectedPlace;
      if (!reading[location] || reading[location][currentParam.key] === null) {
        return null;
      }
      return {
        timestamp: formatChartTime(reading.timestamp),
        value: reading[location][currentParam.key],
      };
    })
    .filter((d) => d !== null);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-xl font-semibold text-gray-800">
            Loading Dashboard
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching real-time data...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              Failed to Load
            </h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-6">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State (No data in database)
  if (!dashboardData || !latestReading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <Waves className="w-20 h-20 text-gray-300 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Belum ada data sensor dari IPAL. Data akan muncul setelah ESP32
              mengirim pembacaan pertama.
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="mt-6"
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Checking..." : "Check Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Water Quality Monitoring
              </h1>
              <p className="text-gray-500 mt-1">
                IPAL Teknik Lingkungan Undip - Real-time Dashboard
              </p>
              {latestReading?.timestamp && (
                <p className="text-xs text-gray-400 mt-1">
                  Last update:{" "}
                  {new Date(latestReading.timestamp).toLocaleString("id-ID")}
                </p>
              )}
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="ghost"
              icon={RefreshCw}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </div>
        </div>

        {/* Stats Overview */}
        {qualityScore > 0 && (
          <StatsOverview
            qualityScore={qualityScore}
            status={fuzzyStatus}
            lastUpdate={latestReading?.timestamp}
          />
        )}

        {/* Location Selector */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Select Monitoring Location
              </p>
              <Select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                options={locationOptions}
                placeholder="Choose Inlet or Outlet..."
              />
            </div>
          </div>

          {!selectedPlace && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Select a location to view detailed
                water quality parameters and trends
              </p>
            </div>
          )}
        </div>

        {/* Parameter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parameters.map((param, idx) => (
            <DataCard
              key={idx}
              title={param.name}
              value={currentData?.[param.key]}
              unit={param.unit}
              icon={param.icon}
              status={selectedPlace ? fuzzyStatus : null}
              isActive={!!selectedPlace}
            />
          ))}
        </div>

        {/* Map & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Panel */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-[500px]">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">IPAL Location</h3>
              <p className="text-xs text-gray-500 mt-1">
                Teknik Lingkungan Undip
              </p>
            </div>
            <div className="h-[calc(100%-72px)]">
              <MapContainer
                center={[-7.0506, 110.4397]}
                zoom={18}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapUpdater location={locations[selectedPlace]} />
                {selectedPlace && (
                  <Marker position={locations[selectedPlace]}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold capitalize">
                          {selectedPlace}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          IPAL Teknik Lingkungan Undip
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {locations[selectedPlace][0].toFixed(6)},{" "}
                          {locations[selectedPlace][1].toFixed(6)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-[500px] flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedPlace
                    ? `${currentParam.name} Trend`
                    : "Parameter Trend"}
                </h3>
                {selectedPlace && (
                  <p className="text-xs text-gray-500 mt-1">Last 24 readings</p>
                )}
              </div>
              {selectedPlace && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentParamIndex((prev) =>
                        prev > 0 ? prev - 1 : parameters.length - 1
                      )
                    }
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Previous parameter"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentParamIndex((prev) =>
                        prev < parameters.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Next parameter"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              {!selectedPlace ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Select a location to view trends
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Choose Inlet or Outlet from the dropdown above
                    </p>
                  </div>
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-full">
                  <LineChart
                    data={chartData}
                    dataKey="value"
                    name={currentParam.name}
                    color={currentParam.color}
                    unit={currentParam.unit}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      No historical data available
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Data will appear after sensor readings
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

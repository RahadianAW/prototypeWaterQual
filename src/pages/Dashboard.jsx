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
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <Waves className="absolute inset-0 m-auto w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-sm text-gray-600">
            Fetching real-time water quality data...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl border p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Waves className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No Data Available
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Belum ada data sensor dari IPAL. Data akan muncul setelah ESP32
              mengirim pembacaan pertama.
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-8 py-3"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Checking..." : "Check Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Waves className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Water Quality Monitoring
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    IPAL Teknik Lingkungan Undip
                  </p>
                  {latestReading?.timestamp && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Last update:{" "}
                      {new Date(latestReading.timestamp).toLocaleString(
                        "id-ID",
                        {
                          dateStyle: "short",
                          timeStyle: "short",
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="ghost"
                className="self-start sm:self-center"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview with Animation */}
        {qualityScore > 0 && (
          <div className="animate-fade-in">
            <StatsOverview
              qualityScore={qualityScore}
              status={fuzzyStatus}
              lastUpdate={latestReading?.timestamp}
            />
          </div>
        )}

        {/* Enhanced Location Selector */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Monitoring Location
                </p>
                <p className="text-xs text-gray-500">Select point to analyze</p>
              </div>
            </div>
            <div className="flex-1">
              <Select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                options={locationOptions}
                placeholder="Choose Inlet or Outlet..."
                className="w-full"
              />
            </div>
          </div>

          {!selectedPlace && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  <strong>💡 Quick Start:</strong> Select a monitoring location
                  above to view detailed water quality parameters, real-time
                  trends, and historical data analysis
                </p>
              </div>
            </div>
          )}

          {selectedPlace && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-900">
                  <strong>✓ Active:</strong> Monitoring{" "}
                  {selectedPlace === "inlet"
                    ? "Inlet (Air Masuk)"
                    : "Outlet (Air Keluar)"}{" "}
                  - Real-time data displayed below
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modern Parameter Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {parameters.map((param, idx) => (
            <div
              key={idx}
              className="transform hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <DataCard
                title={param.name}
                value={currentData?.[param.key]}
                unit={param.unit}
                icon={param.icon}
                status={selectedPlace ? fuzzyStatus : null}
                isActive={!!selectedPlace}
              />
            </div>
          ))}
        </div>

        {/* Enhanced Map & Chart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modern Map Panel */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-[400px] sm:h-[500px]">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">IPAL Location</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Teknik Lingkungan Undip
                  </p>
                </div>
              </div>
            </div>
            <div className="h-[calc(100%-76px)]">
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
                      <div className="text-sm p-2">
                        <p className="font-bold capitalize text-gray-900 mb-1">
                          📍 {selectedPlace}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          IPAL Teknik Lingkungan Undip
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
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

          {/* Modern Chart Panel */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-[400px] sm:h-[500px] flex flex-col">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-purple-50/50 to-pink-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedPlace
                      ? `${currentParam.name} Trend`
                      : "Parameter Trend"}
                  </h3>
                  {selectedPlace && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      Last 24 readings
                    </p>
                  )}
                </div>
              </div>
              {selectedPlace && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentParamIndex((prev) =>
                        prev > 0 ? prev - 1 : parameters.length - 1
                      )
                    }
                    className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:shadow-md"
                    title="Previous parameter"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="text-xs font-medium text-gray-600 px-2">
                    {currentParamIndex + 1} / {parameters.length}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentParamIndex((prev) =>
                        prev < parameters.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:shadow-md"
                    title="Next parameter"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-hidden">
              {!selectedPlace ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-xs">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-2">
                      Select Location First
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose Inlet or Outlet to view real-time trends and
                      historical data
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
                  <div className="text-center max-w-xs">
                    <div className="bg-gradient-to-br from-orange-100 to-amber-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-10 h-10 text-orange-600" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-2">
                      No Historical Data
                    </p>
                    <p className="text-sm text-gray-500">
                      Data will appear after sensor readings are collected
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

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
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import LineChart from "../components/charts/LineChart";

// Services
import dashboardService from "../services/dashboardService";
import sensorService from "../services/sensorServices";

// Helpers
import { getStatusClass, formatChartTime } from "../utils/waterQualityHelpers";

// Perbaiki icon default leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Komponen untuk update posisi map saat lokasi berubah
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
  // IPAL ID = 1 (fixed, karena cuma 1 IPAL di Teknik Lingkungan Undip)
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

  // Lokasi inlet & outlet (lat, lng)
  const locations = {
    inlet: [-7.050665024868658, 110.44008189915155],
    outlet: [-7.050193776750058, 110.44035712980384],
  };

  // Parameter yang mau ditampilkan grafiknya
  const parameters = ["pH", "Temperature", "TDS", "Turbidity"];

  // Map dari nama parameter ke key di API response
  const paramToKey = {
    pH: "ph",
    Temperature: "temperature",
    TDS: "tds",
    Turbidity: "turbidity",
  };

  // ========================================
  // FETCH DATA FROM API
  // ========================================

  /**
   * Fetch dashboard summary saat component mount
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch historical data saat user pilih lokasi
   */
  useEffect(() => {
    if (selectedPlace) {
      fetchHistoricalData();
    }
  }, [selectedPlace]);

  /**
   * Fetch dashboard summary dari backend
   */
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("📊 Fetching dashboard data for IPAL", IPAL_ID);

      const summary = await dashboardService.getSummary(IPAL_ID);

      console.log("✅ Dashboard data received:", summary);

      setDashboardData(summary);
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch historical data untuk chart
   */
  const fetchHistoricalData = async () => {
    try {
      console.log(`📈 Fetching historical data for ${selectedPlace}...`);

      const readings = await sensorService.getReadings({
        ipal_id: IPAL_ID,
        limit: 24, // Last 24 readings
        order: "asc", // Oldest first (untuk time series chart)
      });

      console.log(`✅ Got ${readings.length} historical readings`);

      setHistoricalData(readings);
    } catch (err) {
      console.error("❌ Error fetching historical data:", err);
      // Don't set error state, just log it
      // Chart akan show "No data available"
    }
  };

  /**
   * Manual refresh data
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    if (selectedPlace) {
      await fetchHistoricalData();
    }
    setIsRefreshing(false);
  };

  // ========================================
  // DATA TRANSFORMATION
  // ========================================

  /**
   * Get current data berdasarkan selectedPlace (inlet/outlet)
   */
  const latestReading = dashboardData?.latest_reading;
  const currentData =
    selectedPlace && latestReading ? latestReading[selectedPlace] : null;

  /**
   * Get fuzzy analysis status
   */
  const fuzzyStatus = latestReading?.fuzzy_analysis?.status || null;
  const qualityScore = latestReading?.fuzzy_analysis?.quality_score || 0;

  /**
   * Cards data untuk 4 parameter
   */
  const cardsData = [
    {
      title: "pH Level",
      value: currentData?.ph,
      unit: "",
      parameter: "ph",
      icon: <Droplet className="w-6 h-6" />,
    },
    {
      title: "Temperature",
      value: currentData?.temperature,
      unit: "°C",
      parameter: "temperature",
      icon: <Thermometer className="w-6 h-6" />,
    },
    {
      title: "TDS",
      value: currentData?.tds,
      unit: "ppm",
      parameter: "tds",
      icon: <Waves className="w-6 h-6" />,
    },
    {
      title: "Turbidity",
      value: currentData?.turbidity,
      unit: "NTU",
      parameter: "turbidity",
      icon: <Eye className="w-6 h-6" />,
    },
  ];

  /**
   * Transform historical data untuk chart
   */
  const currentParam = parameters[currentParamIndex];
  const chartData = historicalData
    .map((reading) => {
      const key = paramToKey[currentParam];
      const location = selectedPlace;

      if (!reading[location] || reading[location][key] === null) {
        return null;
      }

      return {
        timestamp: formatChartTime(reading.timestamp),
        value: reading[location][key],
      };
    })
    .filter((d) => d !== null); // Remove null values

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handlePrevParam = () => {
    setCurrentParamIndex((prev) =>
      prev > 0 ? prev - 1 : parameters.length - 1
    );
  };

  const handleNextParam = () => {
    setCurrentParamIndex((prev) =>
      prev < parameters.length - 1 ? prev + 1 : 0
    );
  };

  // ========================================
  // RENDER: LOADING STATE
  // ========================================

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Loading Dashboard...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching data from IPAL Teknik Lingkungan Undip
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER: ERROR STATE
  // ========================================

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER: EMPTY STATE (No data in database)
  // ========================================

  if (!dashboardData || !latestReading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Water Quality Monitoring System
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                IPAL Teknik Lingkungan Undip
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Waves className="w-20 h-20 text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mt-2">
              Belum ada data sensor dari IPAL. Data akan muncul setelah ESP32
              mengirim pembacaan sensor pertama.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <p className="text-sm text-blue-900 font-medium mb-2">
                💡 Cara mengirim data:
              </p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Pastikan ESP32 terhubung ke WiFi</li>
                <li>ESP32 akan otomatis kirim data setiap 5 menit</li>
                <li>
                  Atau kirim manual via Postman ke: POST /api/sensors/readings
                </li>
              </ol>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isRefreshing ? "Checking..." : "Check Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER: MAIN DASHBOARD (Data tersedia)
  // ========================================

  // Get status class untuk cards
  const statusClass = fuzzyStatus
    ? getStatusClass(fuzzyStatus)
    : "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Water Quality Monitoring System
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              IPAL Teknik Lingkungan Undip - Real-time Monitoring
            </p>
            {latestReading?.timestamp && (
              <p className="text-xs text-gray-400 mt-1">
                Last update:{" "}
                {new Date(latestReading.timestamp).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Quality Score Badge */}
            {qualityScore > 0 && (
              <div className="text-right mr-4">
                <p className="text-xs text-gray-500">Quality Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {qualityScore}/100
                </p>
              </div>
            )}
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col space-y-4 p-4 overflow-hidden">
        {/* Dropdown + Cards */}
        <div className="space-y-4">
          {/* Dropdown Selector */}
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
            >
              <option value="">Pilih Lokasi Monitoring</option>
              <option value="inlet">Inlet (Air Masuk)</option>
              <option value="outlet">Outlet (Air Keluar)</option>
            </select>

            {/* Status Badge */}
            {selectedPlace && fuzzyStatus && (
              <div
                className={`px-4 py-2 rounded-lg font-medium ${statusClass} border`}
              >
                Status: {fuzzyStatus}
              </div>
            )}
          </div>

          {/* Parameter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cardsData.map((card, idx) => (
              <div
                key={idx}
                className={`${
                  selectedPlace ? statusClass : "bg-gray-100 text-gray-400"
                } rounded-xl p-4 shadow-sm flex items-center justify-between border transition-all`}
              >
                <div>
                  <p className="text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">
                    {card.value !== null && card.value !== undefined
                      ? `${card.value.toFixed(2)} ${card.unit}`
                      : "-"}
                  </p>
                  {selectedPlace && (
                    <p className="text-xs mt-1 opacity-75">
                      {fuzzyStatus || "Analyzing..."}
                    </p>
                  )}
                </div>
                {card.icon}
              </div>
            ))}
          </div>

          {/* Alert: Pilih lokasi dulu */}
          {!selectedPlace && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Pilih lokasi "Inlet" atau "Outlet"
                untuk melihat data kualitas air secara detail.
              </p>
            </div>
          )}
        </div>

        {/* Map + Chart Panel */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
          {/* Map */}
          <div className="rounded-xl shadow bg-white overflow-hidden border">
            <MapContainer
              center={[-7.0506, 110.4397]}
              zoom={18}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {/* Update posisi map sesuai dropdown */}
              <MapUpdater location={locations[selectedPlace]} />

              {/* Marker hanya muncul kalau ada selectedPlace */}
              {selectedPlace && (
                <Marker position={locations[selectedPlace]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">
                        {selectedPlace.charAt(0).toUpperCase() +
                          selectedPlace.slice(1)}
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

          {/* Panel Trend Chart */}
          <div className="rounded-xl shadow bg-white p-6 border flex flex-col overflow-y-auto">
            {!selectedPlace ? (
              <div className="flex-1 flex items-center justify-center text-center px-4">
                <div>
                  <Waves className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium text-gray-700">
                    Pilih lokasi terlebih dahulu
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Silakan pilih "Inlet" atau "Outlet" pada dropdown untuk
                    melihat grafik tren parameter kualitas air.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Header: Parameter Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevParam}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    ◀
                  </button>
                  <div className="text-center">
                    <span className="font-semibold text-gray-800 text-lg">
                      {currentParam}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Trend 24 pembacaan terakhir
                    </p>
                  </div>
                  <button
                    onClick={handleNextParam}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    ▶
                  </button>
                </div>

                {/* Chart */}
                {chartData.length > 0 ? (
                  <div className="flex-1">
                    <LineChart
                      data={chartData}
                      dataKey="value"
                      name={currentParam}
                      color="#3b82f6"
                      unit={
                        currentParam === "pH"
                          ? ""
                          : currentParam === "Temperature"
                          ? "°C"
                          : currentParam === "TDS"
                          ? " ppm"
                          : " NTU"
                      }
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        No historical data available
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Data akan muncul setelah ada beberapa pembacaan sensor
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

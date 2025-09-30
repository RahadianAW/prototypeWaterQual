// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Droplet, Thermometer, Waves, Eye } from "lucide-react";
import { sensors, currentWaterQuality, historicalData } from "../data/dummyData";
import LineChart from "../components/charts/LineChart";

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

// helper: tentukan warna berdasarkan status
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "normal":
      return "bg-green-100 text-green-700";
    case "warning":
      return "bg-yellow-100 text-yellow-700";
    case "danger":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// helper: kapitalisasi status
const formatStatus = (status) => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const Dashboard = () => {
  const [selectedPlace, setSelectedPlace] = useState("");
  const [currentParamIndex, setCurrentParamIndex] = useState(0);

  // Lokasi inlet & outlet (lat, lng)
  const locations = {
    inlet: [-7.050665024868658, 110.44008189915155],
    outlet: [-7.050193776750058, 110.44035712980384],
  };

  // Filter sensor berdasarkan lokasi
  const filteredSensors = sensors.filter(
    (s) => s.location.toLowerCase() === selectedPlace
  );

  // Filter data kualitas saat ini
  const filteredQuality = currentWaterQuality.filter((q) =>
    filteredSensors.some((s) => s.id === q.sensorId)
  );

  // Parameter yang mau ditampilkan grafiknya
  const parameters = ["pH", "Temperature", "TDS", "Turbidity"];

  // Map dari nama parameter ke key di historicalData object
  const paramToKey = {
    pH: "ph",
    Temperature: "temperature",
    TDS: "tds",
    Turbidity: "turbidity",
  };

  // Ambil data historis berdasarkan parameter dan lokasi
  const getHistory = (parameter, place) => {
    if (!place) return [];
    const key = paramToKey[parameter];
    if (!key) return [];
    const arr = Array.isArray(historicalData[key]) ? historicalData[key] : [];
    const placeLabel = place.charAt(0).toUpperCase() + place.slice(1);
    return arr
      .filter((d) => d.location === placeLabel)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

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

  const currentParam = parameters[currentParamIndex];
  const raw = getHistory(currentParam, selectedPlace);
  const chartData = raw.map((d) => ({
    timestamp: d.timestamp,
    value: d.value,
  }));

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Water Quality Monitoring System
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau kualitas air secara real-time di lokasi yang dipilih
        </p>
      </header>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col space-y-4 p-4 overflow-hidden">
        {/* Dropdown + Cards */}
        <div className="space-y-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
          >
            <option value="">Pilih Tempat</option>
            <option value="inlet">Inlet</option>
            <option value="outlet">Outlet</option>
          </select>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "pH Level",
                data: filteredQuality.find((q) => q.parameter === "pH"),
                icon: <Droplet className="w-6 h-6" />,
              },
              {
                title: "Temperature",
                data: filteredQuality.find((q) => q.parameter === "Temperature"),
                icon: <Thermometer className="w-6 h-6" />,
              },
              {
                title: "TDS",
                data: filteredQuality.find((q) => q.parameter === "TDS"),
                icon: <Waves className="w-6 h-6" />,
              },
              {
                title: "Turbidity",
                data: filteredQuality.find((q) => q.parameter === "Turbidity"),
                icon: <Eye className="w-6 h-6" />,
              },
            ].map((card, idx) => {
              const statusClass = card.data
                ? getStatusClass(card.data.status)
                : "bg-gray-100 text-gray-700";

              return (
                <div
                  key={idx}
                  className={`${statusClass} rounded-xl p-4 shadow-sm flex items-center justify-between`}
                >
                  <div>
                    <p className="text-sm">{card.title}</p>
                    <p className="text-xl font-bold">
                      {card.data ? `${card.data.value} ${card.data.unit}` : "-"}
                    </p>
                    <p className="text-sm">
                      {card.data ? formatStatus(card.data.status) : ""}
                    </p>
                  </div>
                  {card.icon}
                </div>
              );
            })}
          </div>
        </div>

        {/* Map + Panel */}
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
                        {selectedPlace.charAt(0).toUpperCase() + selectedPlace.slice(1)}
                      </p>
                      <p>
                        {locations[selectedPlace][0].toFixed(6)},{" "}
                        {locations[selectedPlace][1].toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

            </MapContainer>
          </div>

          {/* Panel Trend Mini-Chart */}
          <div className="rounded-xl shadow bg-white p-6 border flex flex-col overflow-y-auto">
            {!selectedPlace ? (
              <div className="flex-1 flex items-center justify-center text-center px-4">
                <div>
                  <p className="font-medium text-gray-700">
                    Pilih lokasi terlebih dahulu
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Silakan pilih "Inlet" atau "Outlet" pada dropdown untuk
                    melihat grafik tren.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Tombol navigasi parameter */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={handlePrevParam}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ◀
                  </button>
                  <span className="font-semibold text-gray-700">
                    {currentParam}
                  </span>
                  <button
                    onClick={handleNextParam}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ▶
                  </button>
                </div>

                {chartData.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">No data available</p>
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

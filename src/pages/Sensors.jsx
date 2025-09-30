// src/pages/Sensors.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sensors as initialSensors } from "../data/dummyData";
import { MdOutlineSensors, MdArrowForward, MdAdd, MdClose } from "react-icons/md";

const Sensors = () => {
  const [sensors] = useState(initialSensors); // tidak dipakai untuk tambah sensor
  const [showForm, setShowForm] = useState(false);
  const [showNotice, setShowNotice] = useState(false); // popup notifikasi
  const [newSensor, setNewSensor] = useState({
    type: "",
    location: "Inlet",
    description: "",
    unit: "",
    min: "",
    max: "",
    threshold: "",
    status: "active",
  });

  const locations = [...new Set(sensors.map((s) => s.location))];

  // Handler klik simpan
  const handleAddSensor = (e) => {
    e.preventDefault();
    setShowForm(false); // tutup form
    setShowNotice(true); // tampilkan notifikasi
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MdOutlineSensors className="h-7 w-7 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-800">All Sensors</h2>
        </div>

        {/* Tombol tambah sensor */}
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition"
        >
          <MdAdd className="mr-1" />
          Tambah Sensor
        </button>
      </div>

      {/* Modal Form Tambah Sensor */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            {/* Tombol close */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <MdClose size={22} />
            </button>

            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Tambah Sensor Baru
            </h3>
            <form onSubmit={handleAddSensor} className="space-y-4">
              <input
                type="text"
                placeholder="Sensor Type (ex: pH, TDS, Suhu)"
                value={newSensor.type}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, type: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />

              {/* Dropdown Location */}
              <select
                value={newSensor.location}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, location: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              >
                <option value="Inlet">Inlet</option>
                <option value="Outlet">Outlet</option>
              </select>

              <input
                type="text"
                placeholder="Description"
                value={newSensor.description}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, description: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Unit (ex: pH, °C, ppm)"
                value={newSensor.unit}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, unit: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />

              {/* Range normal */}
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min Value"
                  value={newSensor.min}
                  onChange={(e) =>
                    setNewSensor({ ...newSensor, min: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 text-sm w-1/2"
                />
                <input
                  type="number"
                  placeholder="Max Value"
                  value={newSensor.max}
                  onChange={(e) =>
                    setNewSensor({ ...newSensor, max: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 text-sm w-1/2"
                />
              </div>

              <input
                type="number"
                placeholder="Threshold (Ambang Batas)"
                value={newSensor.threshold}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, threshold: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />

              <select
                value={newSensor.status}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, status: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Notifikasi */}
      {showNotice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Feature Not Available
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This feature is coming soon.
            </p>
            <button
              onClick={() => setShowNotice(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Loop per lokasi */}
      {locations.map((loc) => (
        <div key={loc} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">{loc}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensors
              .filter((s) => s.location === loc)
              .map((sensor) => (
                <div
                  key={sensor.id}
                  className="bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {sensor.type}{" "}
                      {sensor.unit && (
                        <span className="text-gray-500 text-sm">
                          ({sensor.unit})
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {sensor.description}
                    </p>
                    {sensor.min && sensor.max && (
                      <p className="text-gray-500 text-xs mt-1">
                        Range: {sensor.min} – {sensor.max} {sensor.unit}
                      </p>
                    )}
                    {sensor.threshold && (
                      <p className="text-red-500 text-xs mt-1">
                        Threshold: {sensor.threshold} {sensor.unit}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        sensor.status === "active"
                          ? "bg-success-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span className="ml-2 text-sm text-gray-600">
                      {sensor.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/sensors/${sensor.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Detail
                      <MdArrowForward className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sensors;

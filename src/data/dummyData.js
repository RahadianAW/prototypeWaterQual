// src/data/dummyData.js

// Data sensors
export const sensors = [
    {
      id: 1,
      type: "pH Sensor",
      location: "Danau Undip",
      description: "Sensor pH di area Danau Universitas Diponegoro",
      status: "active",
      lastReading: "2025-04-25T08:30:00",
    },
    {
      id: 2,
      type: "Temperature Sensor",
      location: "Danau Undip",
      description: "Sensor suhu di area Danau Universitas Diponegoro",
      status: "active",
      lastReading: "2025-04-25T08:30:00",
    },
    {
      id: 3,
      type: "TDS Sensor",
      location: "Kolam Teknik",
      description: "Sensor TDS di area Fakultas Teknik",
      status: "active",
      lastReading: "2025-04-25T08:25:00",
    },
    {
      id: 4,
      type: "Turbidity Sensor",
      location: "Kolam Teknik",
      description: "Sensor Kekeruhan di area Fakultas Teknik",
      status: "inactive",
      lastReading: "2025-04-25T07:45:00",
    },
  ];
  
  // Data kualitas air terkini
  export const currentWaterQuality = [
    {
      id: 1,
      sensorId: 1,
      parameter: "pH",
      value: 7.2,
      unit: "",
      timestamp: "2025-04-25T08:30:00",
      threshold: { min: 6.5, max: 8.5 },
      status: "normal"
    },
    {
      id: 2,
      sensorId: 2,
      parameter: "Temperature",
      value: 28.5,
      unit: "°C",
      timestamp: "2025-04-25T08:30:00",
      threshold: { min: 25, max: 30 },
      status: "normal"
    },
    {
      id: 3,
      sensorId: 3,
      parameter: "TDS",
      value: 480,
      unit: "ppm",
      timestamp: "2025-04-25T08:25:00",
      threshold: { min: 0, max: 500 },
      status: "warning"
    },
    {
      id: 4,
      sensorId: 4,
      parameter: "Turbidity",
      value: 15,
      unit: "NTU",
      timestamp: "2025-04-25T07:45:00",
      threshold: { min: 0, max: 10 },
      status: "danger"
    },
  ];
  
  // Data historis untuk grafik
  export const historicalData = {
    ph: [
      { timestamp: "2025-04-25T00:00:00", value: 7.0 },
      { timestamp: "2025-04-25T01:00:00", value: 7.1 },
      { timestamp: "2025-04-25T02:00:00", value: 7.2 },
      { timestamp: "2025-04-25T03:00:00", value: 7.0 },
      { timestamp: "2025-04-25T04:00:00", value: 6.9 },
      { timestamp: "2025-04-25T05:00:00", value: 7.0 },
      { timestamp: "2025-04-25T06:00:00", value: 7.1 },
      { timestamp: "2025-04-25T07:00:00", value: 7.3 },
      { timestamp: "2025-04-25T08:00:00", value: 7.2 },
    ],
    temperature: [
      { timestamp: "2025-04-25T00:00:00", value: 27.5 },
      { timestamp: "2025-04-25T01:00:00", value: 27.0 },
      { timestamp: "2025-04-25T02:00:00", value: 26.8 },
      { timestamp: "2025-04-25T03:00:00", value: 26.5 },
      { timestamp: "2025-04-25T04:00:00", value: 26.2 },
      { timestamp: "2025-04-25T05:00:00", value: 26.8 },
      { timestamp: "2025-04-25T06:00:00", value: 27.3 },
      { timestamp: "2025-04-25T07:00:00", value: 28.0 },
      { timestamp: "2025-04-25T08:00:00", value: 28.5 },
    ],
    tds: [
      { timestamp: "2025-04-25T00:00:00", value: 450 },
      { timestamp: "2025-04-25T01:00:00", value: 455 },
      { timestamp: "2025-04-25T02:00:00", value: 460 },
      { timestamp: "2025-04-25T03:00:00", value: 458 },
      { timestamp: "2025-04-25T04:00:00", value: 462 },
      { timestamp: "2025-04-25T05:00:00", value: 465 },
      { timestamp: "2025-04-25T06:00:00", value: 470 },
      { timestamp: "2025-04-25T07:00:00", value: 475 },
      { timestamp: "2025-04-25T08:00:00", value: 480 },
    ],
    turbidity: [
      { timestamp: "2025-04-25T00:00:00", value: 8 },
      { timestamp: "2025-04-25T01:00:00", value: 8.5 },
      { timestamp: "2025-04-25T02:00:00", value: 9 },
      { timestamp: "2025-04-25T03:00:00", value: 9.5 },
      { timestamp: "2025-04-25T04:00:00", value: 10 },
      { timestamp: "2025-04-25T05:00:00", value: 11 },
      { timestamp: "2025-04-25T06:00:00", value: 12 },
      { timestamp: "2025-04-25T07:00:00", value: 14 },
      { timestamp: "2025-04-25T08:00:00", value: 15 },
    ],
  };
  
  // Data alerts/peringatan
  export const alerts = [
    {
      id: 1,
      sensorId: 4,
      parameter: "Turbidity",
      value: 15,
      threshold: 10,
      timestamp: "2025-04-25T07:45:00",
      status: "active",
      message: "Kekeruhan air melampaui ambang batas di Kolam Teknik"
    },
    {
      id: 2,
      sensorId: 3,
      parameter: "TDS",
      value: 480,
      threshold: 500,
      timestamp: "2025-04-25T08:25:00",
      status: "active",
      message: "TDS mendekati ambang batas di Kolam Teknik"
    },
    {
      id: 3,
      sensorId: 1,
      parameter: "pH",
      value: 8.7,
      threshold: 8.5,
      timestamp: "2025-04-24T16:30:00",
      status: "resolved",
      message: "pH air melampaui ambang batas di Danau Undip"
    },
  ];
  
  // Data users
  export const users = [
    {
      id: 1,
      username: "admin",
      email: "admin@undip.ac.id",
      role: "admin",
    },
    {
      id: 2,
      username: "operator",
      email: "operator@undip.ac.id",
      role: "operator",
    },
  ];
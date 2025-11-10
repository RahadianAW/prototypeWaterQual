// src/App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import SensorDetail from "./pages/SensorDetail";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import DashboardLayout from "./components/layout/DashboardLayout";
import Sensors from "./pages/Sensors";
import {
  requestNotificationPermission,
  registerFCMToken,
  onMessageListener,
} from "./services/fcmService";

function App() {
  // ⭐ FCM INITIALIZATION
  useEffect(() => {
    const initFCM = async () => {
      // Check if user is logged in
      const token = localStorage.getItem("token");

      if (token) {
        console.log("🔔 Initializing FCM...");

        try {
          // Request notification permission & get FCM token
          const result = await requestNotificationPermission();

          if (result.success && result.token) {
            console.log("✅ FCM Token obtained");

            // Register token to backend
            await registerFCMToken(result.token);
          } else {
            console.log("⚠️ FCM initialization skipped:", result.error);
          }
        } catch (error) {
          console.error("❌ FCM initialization error:", error);
        }
      } else {
        console.log("ℹ️ User not logged in, skipping FCM");
      }
    };

    // Initialize FCM
    initFCM();

    // Listen for foreground notifications
    onMessageListener((payload) => {
      console.log("📬 Foreground notification received:", payload);

      // Optional: Show toast notification in UI
      // You can add react-toastify or custom notification here
      alert(`🔔 ${payload.notification.title}\n${payload.notification.body}`);
    });
  }, []); // Run once on mount

  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/sensors/:id" element={<SensorDetail />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;

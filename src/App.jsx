// src/App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SensorDetail from "./pages/SensorDetail";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import DashboardLayout from "./components/layout/DashboardLayout";
import Sensors from "./pages/Sensors";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  requestNotificationPermission,
  registerFCMToken,
  onMessageListener,
} from "./services/fcmService";

function App() {
  // ⭐ FCM INITIALIZATION
  useEffect(() => {
    let unsubscribe = null;

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

            // Listen for foreground notifications (after successful init)
            unsubscribe = onMessageListener((payload) => {
              console.log("📬 Foreground notification received:", payload);

              // Optional: Show toast notification in UI
              // You can add react-toastify or custom notification here
              alert(
                `🔔 ${payload.notification.title}\n${payload.notification.body}`
              );
            });
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

    // Cleanup: unsubscribe from message listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Run once on mount

  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
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

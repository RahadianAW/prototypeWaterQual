// src/App.jsx
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

function App() {
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

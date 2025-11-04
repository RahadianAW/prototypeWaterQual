// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdSensors,
  MdNotifications,
  MdAssessment,
  MdSettings,
  MdLogout,
  MdClose,
  MdWaterDrop,
} from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:z-auto shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header with animated water effect */}
        <div className="relative px-6 py-6 md:py-8 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg">
                <MdWaterDrop className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Water Monitor
                </span>
                <p className="text-xs text-primary-300">Real-time Analytics</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar content */}
        <div className="px-4 py-2 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          <nav className="space-y-1">
            {/* Main Navigation */}
            <div className="mb-6">
              <p className="px-3 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                Main Menu
              </p>
              <NavItem
                to="/dashboard"
                icon={<MdDashboard />}
                label="Dashboard"
              />
              <NavItem to="/sensors/" icon={<MdSensors />} label="Sensors" />
              <NavItem
                to="/alerts"
                icon={<MdNotifications />}
                label="Alerts"
                badge="3"
              />
              <NavItem to="/reports" icon={<MdAssessment />} label="Reports" />
            </div>

            {/* Settings & Account */}
            <div className="pt-4 border-t border-primary-700/50">
              <p className="px-3 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                Account
              </p>
              <NavItem to="/settings" icon={<MdSettings />} label="Settings" />
              <NavItem to="/" icon={<MdLogout />} label="Logout" />
            </div>
          </nav>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
};

const NavItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30"
            : "text-primary-200 hover:bg-primary-700/40 hover:text-white hover:translate-x-1"
        }`
      }
    >
      <div className="flex items-center">
        <span
          className={`mr-3 text-xl transition-transform group-hover:scale-110`}
        >
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default Sidebar;

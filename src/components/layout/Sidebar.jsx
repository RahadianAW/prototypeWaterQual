// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdSensors,
  MdNotifications,
  MdAssessment,
  MdLogout,
  MdClose,
  MdWaterDrop,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-all duration-300 md:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:z-auto shadow-2xl border-r border-white/5 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="relative px-5 py-5 border-b border-white/10 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 backdrop-blur-sm flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl blur-md opacity-40"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-xl ring-1 ring-white/20">
                  <MdWaterDrop className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  IPAL Monitor
                </h1>
                <p className="text-xs text-cyan-300/90 font-medium">
                  Teknik Lingkungan
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95"
              aria-label="Close sidebar"
            >
              <MdClose className="w-5 h-5 text-white/80 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto custom-scrollbar">
          {/* Main Menu */}
          <div className="mb-6">
            <h2 className="px-3 mb-3 text-[10px] font-bold text-cyan-300/70 uppercase tracking-widest">
              Menu Utama
            </h2>
            <div className="space-y-1">
              <NavItem
                to="/dashboard"
                icon={<MdDashboard />}
                label="Dashboard"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/sensors"
                icon={<MdSensors />}
                label="Sensors"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/alerts"
                icon={<MdNotifications />}
                label="Alerts"
                badge="3"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/reports"
                icon={<MdAssessment />}
                label="Reports"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-white/10 bg-gradient-to-t from-slate-950/80 to-transparent backdrop-blur-sm">
          {user && (
            <div className="mb-3 px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-white/20 flex-shrink-0">
                  <span className="text-base font-bold text-white">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-[11px] text-cyan-300/80 truncate font-mono">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-200 hover:text-white hover:bg-red-500/15 transition-all duration-200 group border border-transparent hover:border-red-400/20 active:scale-[0.98]"
          >
            <MdLogout className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.25);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </>
  );
};

const NavItem = ({ to, icon, label, badge, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/15 text-white shadow-lg shadow-blue-500/5 border border-blue-400/30 font-semibold"
            : "text-blue-100/90 hover:bg-white/8 hover:text-white hover:translate-x-0.5 border border-transparent hover:border-white/5"
        }`
      }
    >
      <div className="flex items-center space-x-3">
        <span
          className={`text-[22px] transition-all duration-200 group-hover:scale-110`}
        >
          {icon}
        </span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full shadow-lg shadow-red-500/30 animate-pulse">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default Sidebar;

// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdMenu,
  MdNotifications,
  MdSearch,
  MdLogout,
  MdWaterDrop,
} from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import authService from "../../services/authServices";
import LogoutModal from "../ui/LogoutModal";
import IPALSelector from "../ipal/IPALSelector";

const Navbar = ({ setSidebarOpen }) => {
  const [user, setUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target)
      ) {
        setNotifMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setShowLogoutModal(false);
    setProfileMenuOpen(false);
    navigate("/login"); // Redirect to login page
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <header className="relative z-10 bg-gradient-to-r from-white/95 via-cyan-50/90 to-blue-50/95 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
      {/* Border bottom yang seamless */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/20 via-cyan-200/60 to-blue-200/60"></div>

      <div className="px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl text-cyan-700 hover:text-cyan-900 hover:bg-cyan-100 transition-all duration-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-cyan-500/30 active:scale-95"
              aria-label="Toggle sidebar"
            >
              <MdMenu className="w-6 h-6" />
            </button>

            {/* Page Title - Desktop */}
            <div className="hidden md:block">
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
                Water Quality Dashboard
              </h2>
              <p className="text-xs text-cyan-600 font-semibold mt-0.5">
                💧 Real-time monitoring system
              </p>
            </div>

            {/* Mobile Logo & Title */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg blur-sm opacity-40"></div>
                <div className="relative p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                  <MdWaterDrop className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-base font-bold text-slate-900">
                IPAL Monitor
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* IPAL Selector */}
            <IPALSelector />

            {/* Notifications */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95"
                aria-label="Notifications"
              >
                <MdNotifications className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white shadow-lg shadow-red-500/30 animate-pulse"></span>
              </button>

              {/* Notifications Dropdown */}
              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3.5 border-b border-slate-200/80 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                    <h3 className="text-sm font-bold text-slate-900">
                      Notifications
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      You have 3 unread notifications
                    </p>
                  </div>
                  <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                    <NotificationItem
                      type="alert"
                      title="High pH Level Detected"
                      message="Sensor S-001 detected pH level of 8.5"
                      time="5 minutes ago"
                      unread
                    />
                    <NotificationItem
                      type="warning"
                      title="Low Dissolved Oxygen"
                      message="DO level dropped below 4.0 mg/L"
                      time="1 hour ago"
                      unread
                    />
                    <NotificationItem
                      type="info"
                      title="System Update"
                      message="Dashboard updated with new features"
                      time="2 hours ago"
                    />
                  </div>
                  <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50">
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative ml-2" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95 group"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white">
                    <span className="text-sm font-bold text-white">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-slate-600 leading-tight font-mono truncate max-w-[120px]">
                    {user?.email || ""}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-4 border-b border-slate-200/80 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white">
                        <span className="text-base font-bold text-white">
                          {user?.email?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.displayName ||
                            user?.email?.split("@")[0] ||
                            "User"}
                        </p>
                        <p className="text-xs text-slate-600 truncate font-mono">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <MenuItem
                      icon={<FaUser className="w-4 h-4" />}
                      label="Profile Settings"
                    />
                    <MenuItem
                      icon={<IoMdSettings className="w-4 h-4" />}
                      label="Preferences"
                    />
                  </div>

                  <div className="border-t border-slate-200/80 py-2">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <MdLogout className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-sm font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-3 animate-fadeIn">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MdSearch className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 text-slate-900 text-sm rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 focus:bg-white transition-all duration-200"
                placeholder="Search sensors, reports..."
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.35);
        }
      `}</style>
    </header>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
  >
    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
      {icon}
    </span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const NotificationItem = ({ type, title, message, time, unread }) => {
  return (
    <div
      className={`px-4 py-3.5 border-b border-slate-200/80 hover:bg-slate-50/50 transition-colors cursor-pointer ${
        unread ? "bg-blue-50/30" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
            unread ? "bg-blue-600 shadow-lg shadow-blue-500/30" : "bg-slate-300"
          }`}
        ></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
          <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
            {message}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

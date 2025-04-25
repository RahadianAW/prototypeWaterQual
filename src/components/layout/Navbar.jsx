// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { MdMenu, MdNotifications, MdPerson } from 'react-icons/md';
import { alerts } from '../../data/dummyData';

const Navbar = ({ setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Count active alerts
  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <MdMenu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 md:ml-0 text-lg font-medium text-gray-800">Water Quality Monitoring System</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                type="button"
                className="relative p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <MdNotifications className="h-6 w-6" />
                {activeAlerts > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications dropdown menu */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">Notifications</p>
                    </div>
                    
                    {alerts.filter(alert => alert.status === 'active').map((alert) => (
                      <div key={alert.id} className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className={`h-3 w-3 rounded-full ${
                              alert.parameter === 'Turbidity' ? 'bg-danger-500' : 'bg-warning-500'
                            }`} />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.parameter} Alert</p>
                            <p className="text-sm text-gray-500">{alert.message}</p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {activeAlerts === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No new notifications
                      </div>
                    )}
                    
                    <div className="border-t border-gray-100 px-4 py-2">
                      <a
                        href="/alerts"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <MdPerson className="h-8 w-8" />
              </button>

              {/* Profile dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Admin</p>
                      <p className="text-sm text-gray-500">admin@undip.ac.id</p>
                    </div>
                    <a
                      href="#profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <a
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
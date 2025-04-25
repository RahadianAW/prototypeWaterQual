// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdSensors, 
  MdNotifications, 
  MdAssessment,
  MdSettings,
  MdLogout,
  MdClose
} from 'react-icons/md';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100 ease-out' : 'opacity-0 ease-in pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3 md:py-6">
          <div className="flex items-center">
            <span className="text-xl font-bold">Water Monitoring</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="px-4 py-4">
          <nav className="space-y-2">
            <NavItem to="/" icon={<MdDashboard />} label="Dashboard" />
            <NavItem to="/sensors/1" icon={<MdSensors />} label="Sensors" />
            <NavItem to="/alerts" icon={<MdNotifications />} label="Alerts" />
            <NavItem to="/reports" icon={<MdAssessment />} label="Reports" />
            
            <div className="pt-6 mt-6 border-t border-primary-700">
              <NavItem to="/settings" icon={<MdSettings />} label="Settings" />
              <NavItem to="/login" icon={<MdLogout />} label="Logout" />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? 'bg-primary-700 text-white' 
            : 'text-primary-200 hover:bg-primary-700 hover:text-white'
        }`
      }
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Users, 
  BarChart3, 
  GraduationCap,
  AlertTriangle
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleAlertClick = () => {
    // Navigate to dashboard if not already there
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Scroll to Recent Alerts section after a short delay to ensure page loads
    setTimeout(() => {
      const alertsSection = document.querySelector('[data-section="recent-alerts"]');
      if (alertsSection) {
        alertsSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 200);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/single-prediction', label: 'Single Prediction', icon: User },
    { path: '/bulk-prediction', label: 'Bulk Prediction', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/students', label: 'Students', icon: Users },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg border-b border-blue-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Title */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-4 cursor-pointer hover:opacity-90 transition-opacity duration-200"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-200">
              <GraduationCap className="w-7 h-7 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-sm hover:text-blue-100 transition-colors duration-200">
                Dropout Predictor
              </h1>
              <p className="text-sm text-blue-100 font-medium">Team Aetheron - SIH 2025</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm border border-white border-opacity-30 transform scale-105'
                      : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-15 hover:shadow-md hover:transform hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Alert indicator and actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAlertClick}
              className="nav-alert relative p-3 text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-15 rounded-xl transition-all duration-300 hover:shadow-md hover:transform hover:scale-110 cursor-pointer"
              title="View Recent Alerts"
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg">
                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping"></span>
              </span>
            </button>
            
            <div className="hidden md:flex items-center space-x-2 ml-2 pl-3 border-l border-blue-400 border-opacity-50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-100 font-medium">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
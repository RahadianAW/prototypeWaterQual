import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Droplets, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>

          {/* Water Drop Icon with Animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-primary-100 rounded-full animate-pulse"></div>
            </div>
            <div className="relative flex justify-center">
              <Droplets className="w-24 h-24 text-primary-600 animate-bounce" />
            </div>
          </div>

          {/* 404 Number with Gradient */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-2">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 text-warning-600 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Page Not Found</span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto rounded-full"></div>
          </div>

          {/* Message */}
          <div className="mb-8 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Oops! This Stream Has Dried Up
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved to
              another location. Let's get you back on track!
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-primary-400 hover:text-primary-600 font-medium"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-md hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-medium"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go to Dashboard
            </button>
          </div>

          {/* Water Quality Illustration */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Water Quality
                </p>
              </div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 font-medium">Monitoring</p>
              </div>
              <div className="text-center opacity-30">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-300 font-medium">System</p>
              </div>
            </div>
          </div>

          {/* Animated Wave Background */}
          <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10 overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,60 C300,90 600,30 900,60 C1050,75 1150,60 1200,60 L1200,120 L0,120 Z"
                fill="#0284c7"
              >
                <animate
                  attributeName="d"
                  dur="5s"
                  repeatCount="indefinite"
                  values="
                    M0,60 C300,90 600,30 900,60 C1050,75 1150,60 1200,60 L1200,120 L0,120 Z;
                    M0,60 C300,30 600,90 900,60 C1050,45 1150,60 1200,60 L1200,120 L0,120 Z;
                    M0,60 C300,90 600,30 900,60 C1050,75 1150,60 1200,60 L1200,120 L0,120 Z
                  "
                />
              </path>
            </svg>
          </div>
        </div>

        {/* Additional Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              Return to Dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

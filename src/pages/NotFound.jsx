import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Droplets,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Water Drops */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float ${
              mounted ? "opacity-100" : "opacity-0"
            } transition-opacity duration-1000`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Droplets
              className="text-cyan-400/20"
              size={24 + Math.random() * 24}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center max-w-2xl mx-auto transform transition-all duration-1000 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* 404 Icon */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/10">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-3 sm:mb-4 md:mb-6">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl animate-gradient">
            404
          </span>
        </h1>

        {/* Error Message */}
        <div className="mb-6 sm:mb-8 md:mb-10 space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-cyan-200/80 max-w-md mx-auto px-4">
            Oops! The water quality data you're looking for seems to have
            evaporated...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-lg border border-white/20 hover:border-white/30 text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 flex items-center justify-center gap-2.5 font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2.5 font-semibold text-sm sm:text-base"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-8 sm:mt-10 md:mt-12 text-xs sm:text-sm text-cyan-300/60 flex items-center justify-center gap-2 px-4">
          <Droplets className="w-4 h-4" />
          <span>Need help? Contact your system administrator</span>
        </p>
      </div>

      {/* Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="url(#wave-gradient)"
            className="animate-wave"
          />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0e7490" stopOpacity="0.3" />
              <stop offset="0.5" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default NotFound;

// src/components/ui/LoadingScreen.jsx
import React from "react";
import { Waves } from "lucide-react";
import Spinner from "./Spinner";

/**
 * Full Screen Loading Component dengan Water Theme
 * @param {string} message - Loading message text
 * @param {React.Component} icon - Custom icon component (optional)
 * @param {string} size - Spinner size: 'sm', 'md', 'lg', 'xl'
 */
const LoadingScreen = ({
  message = "Loading...",
  icon: Icon = Waves,
  size = "xl",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
      <div className="text-center">
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Background blur circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

          {/* Border spinner */}
          <div className="absolute inset-0 border-4 border-cyan-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-10 h-10 text-cyan-600 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {message}
        </h2>
        <p className="text-sm text-cyan-600 animate-pulse">
          Please wait a moment...
        </p>

        {/* Water wave animation */}
        <div className="mt-8 flex justify-center space-x-2">
          <div
            className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-sky-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

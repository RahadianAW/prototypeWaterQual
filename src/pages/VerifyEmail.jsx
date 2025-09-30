// src/pages/Verify.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Verify() {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(30); 
  };

  const handleVerify = (e) => {
    e.preventDefault(); 
    alert("This feature is not available yet.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-teal-300 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md text-center">
        
        {/* Water drop logo */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12 text-blue-500"
          >
            <path d="M12 2C12 2 6 10 6 15a6 6 0 0012 0c0-5-6-13-6-13z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Please enter the OTP code we sent to your email.
        </p>

        {/* Input OTP */}
        <form className="space-y-4" onSubmit={handleVerify}>
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-white rounded-md py-2 font-medium transition"
          >
            Verify
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center text-gray-600">
          {countdown > 0 ? (
            <p>
              You can resend the OTP in{" "}
              <span className="font-semibold text-blue-600">
                {countdown} seconds
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-500 font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Back to Sign Up */}
        <p className="text-sm text-gray-600 mt-4">
          Back to{" "}
          <Link to="/signup" className="text-blue-500 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Verify;

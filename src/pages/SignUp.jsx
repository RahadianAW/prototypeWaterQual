// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users } from "../data/dummyData";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // cek apakah email sudah terdaftar
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setError("Email already registered");
      return;
    }

    // buat user baru dengan role default = guest
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      role: "guest", // default role
      isVerified: false, // user baru harus diverifikasi dulu
    };

    // simpan ke localStorage (sementara)
    const savedUsers = JSON.parse(localStorage.getItem("users")) || users;
    savedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(savedUsers));

    // simpan user yg sedang proses verifikasi
    localStorage.setItem("pendingUser", JSON.stringify(newUser));

    setError("");
    // redirect ke halaman verifikasi, bukan langsung dashboard
    navigate("/verify");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-teal-300">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
        {/* Logo tetesan air */}
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

        {/* Judul */}
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Account
        </h1>
        <p className="text-gray-500 text-sm mb-6">Sign up to get started</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-white rounded-md py-2 font-medium"
          >
            Sign Up
          </button>
        </form>

        {/* Back to login */}
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

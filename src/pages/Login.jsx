import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Using AuthContext for login

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles the form submission, checks if the email and password are valid,
   * and redirects the user to the dashboard if valid.
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setIsLoading(true); // Set loading state

    try {
      console.log("📤 Submitting login form...");
      console.log("   Email:", email);

      // Using the updated login function from AuthContext
      await login(email, password);

      console.log("✅ Login successful! Redirecting to dashboard...");
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
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
            className="w-16 h-16 text-blue-500"
          >
            <path d="M12 2C12 2 6 10 6 15a6 6 0 0012 0c0-5-6-13-6-13z" />
          </svg>
        </div>

        {/* Judul */}
        <h1 className="text-2xl font-bold text-gray-900">
          Water Quality Monitoring
        </h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-cyan-400 hover:bg-cyan-500 text-white rounded-md py-2 font-medium ${
              isLoading ? "cursor-not-allowed bg-gray-400" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up */}
        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-medium">
            Sign Up
          </Link>
        </p>

        {/* Test Credentials Info (Development Only) */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">
            Test Credentials:
          </p>
          <p className="text-xs text-blue-600">
            Email: fattah.afr2@gmail.com
            <br />
            Password: (your password)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

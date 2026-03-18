import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      // Fixed logic: Error handling is now inside the catch block
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added dark mode background and transition
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      
      {/* Added dark mode card background */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        
        {/* Updated text colors for dark mode */}
        <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-6">
           Login
        </h1>

        {error && (
          // Updated error banner colors
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            // Added dark mode input styles
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            // Added dark mode input styles
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            // Button usually keeps bright colors, slight adjustment for dark mode aesthetics
            className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 dark:hover:bg-red-500 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Updated footer text colors */}
        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-red-600 dark:text-red-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
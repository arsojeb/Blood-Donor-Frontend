import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 w-full">
      
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        Blood Donation
      </Link>

      {/* ================= DESKTOP MENU ================= */}
      <div className="hidden md:flex gap-6 items-center">

        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/search" className="hover:underline">
          Search Donors
        </Link>

        {user && (
          <>
            <Link to="/dashboard/my-requests" className="hover:underline">
              My Requests
            </Link>

            <Link to="/dashboard/donate" className="hover:underline">
              Create Request
            </Link>

            {(user.role === "admin" || user.role === "volunteer") && (
              <>
                <Link to="/dashboard/admin" className="hover:underline">
                  Admin Dashboard
                </Link>

                <Link to="/dashboard/funding" className="hover:underline">
                  Funding
                </Link>
              </>
            )}
          </>
        )}

        {/* Auth Section */}
        {user ? (
          <>
            <span className="bg-white text-red-600 px-3 py-1 rounded">
              {user.name || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border border-white px-4 py-2 rounded hover:bg-white hover:text-red-600"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-red-600 text-white flex flex-col gap-3 p-4 md:hidden z-40">

          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>

          <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
            Search Donors
          </Link>

          {user && (
            <>
              <Link to="/dashboard/my-requests" onClick={() => setMobileMenuOpen(false)}>
                My Requests
              </Link>

              <Link to="/dashboard/donate" onClick={() => setMobileMenuOpen(false)}>
                Create Request
              </Link>

              {(user.role === "admin" || user.role === "volunteer") && (
                <>
                  <Link to="/dashboard/admin" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>

                  <Link to="/dashboard/funding" onClick={() => setMobileMenuOpen(false)}>
                    Funding
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-left bg-white text-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="bg-white text-red-600 px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border border-white px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
         Blood Donation
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/search" className="hover:underline">
          Search Donors
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 bg-white text-red-600 px-4 py-1 rounded hover:bg-gray-100"
            >
              {user.name || user.email} ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-red-600 rounded shadow-lg z-10 flex flex-col">
                <Link
                  to="/dashboard/my-requests"
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Requests
                </Link>

                <Link
                  to="/dashboard/donate"
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Create Request
                </Link>

                {(user.role === "admin" || user.role === "volunteer") && (
                  <>
                    <Link
                      to="/dashboard/admin"
                      className="px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/dashboard/funding"
                      className="px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Funding
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-red-600 px-4 py-1 rounded hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white px-4 py-1 rounded hover:bg-white hover:text-red-600"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-red-600 text-white flex flex-col gap-2 p-4 md:hidden z-20">
          <Link to="/" className="hover:underline" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/search" className="hover:underline" onClick={() => setMobileMenuOpen(false)}>
            Search Donors
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard/my-requests"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Requests
              </Link>

              <Link
                to="/dashboard/donate"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Request
              </Link>

              {(user.role === "admin" || user.role === "volunteer") && (
                <>
                  <Link
                    to="/dashboard/admin"
                    className="hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/funding"
                    className="hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Funding
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-left hover:bg-gray-100 text-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-white px-4 py-2 rounded hover:bg-white hover:text-red-600"
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

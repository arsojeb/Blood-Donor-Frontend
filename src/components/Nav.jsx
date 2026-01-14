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
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center
                    sticky top-0 z-50 w-full">
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

        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              {user.name || user.email} ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded shadow-lg z-50">
                <Link
                  to="/dashboard/my-requests"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Requests
                </Link>

                <Link
                  to="/dashboard/donate"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Create Request
                </Link>

                {(user.role === "admin" || user.role === "volunteer") && (
                  <>
                    <Link
                      to="/dashboard/admin"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>

                    <Link
                      to="/dashboard/funding"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Funding
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
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

      {/* ================= MOBILE MENU ================= */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-red-600 text-white
                        flex flex-col gap-3 p-4 md:hidden z-40">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
            Search Donors
          </Link>

          {user ? (
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
          ) : (
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

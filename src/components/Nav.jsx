import { NavLink, useNavigate } from "react-router-dom";
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

  // Helper function for styling active links
  const linkStyle = ({ isActive }) =>
    `transition ${
      isActive
        ? "font-bold underline underline-offset-4 decoration-white"
        : "hover:underline"
    }`;

  return (
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 w-full shadow-md">
      
      {/* Logo */}
      <NavLink to="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition">
        Blood Donation
      </NavLink>

      {/* ================= DESKTOP MENU ================= */}
      <div className="hidden md:flex gap-6 items-center">

        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>

        <NavLink to="/search" className={linkStyle}>
          Search Donors
        </NavLink>

        {/* Dashboard Section for Desktop */}
        {user && (
          <>
            <NavLink to="/dashboard" className={linkStyle}>
              Dashboard
            </NavLink>

            <NavLink to="/dashboard/my-requests" className={linkStyle}>
              My Requests
            </NavLink>

            <NavLink to="/dashboard/donate" className={linkStyle}>
              Create Request
            </NavLink>

            {(user.role === "admin" || user.role === "volunteer") && (
              <>
                <NavLink to="/dashboard/admin" className={linkStyle}>
                  Admin Dashboard
                </NavLink>

                <NavLink to="/dashboard/funding" className={linkStyle}>
                  Funding
                </NavLink>
              </>
            )}
          </>
        )}

        {/* Auth Section */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="bg-white/20 text-sm px-3 py-1 rounded-full border border-white/30">
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition shadow-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition shadow-sm"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="border-2 border-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-3xl focus:outline-none transition-transform duration-300"
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* ================= MOBILE MENU ================= */}
      <div 
        className={`absolute top-full left-0 w-full bg-red-600 text-white flex flex-col gap-4 p-6 md:hidden z-40 shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        
        <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
          Home
        </NavLink>

        <NavLink to="/search" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
          Search Donors
        </NavLink>

        {/* Dashboard Section for Mobile */}
        {user && (
          <>
            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
              Dashboard
            </NavLink>

            <NavLink to="/dashboard/my-requests" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
              My Requests
            </NavLink>

            <NavLink to="/dashboard/donate" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
              Create Request
            </NavLink>

            {(user.role === "admin" || user.role === "volunteer") && (
              <>
                <NavLink to="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
                  Admin Dashboard
                </NavLink>

                <NavLink to="/dashboard/funding" onClick={() => setMobileMenuOpen(false)} className={linkStyle}>
                  Funding
                </NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              className="text-left bg-white text-red-600 px-4 py-2 rounded mt-2 font-semibold"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <div className="flex flex-col gap-3 mt-2">
            <NavLink
              to="/login"
              className="bg-white text-red-600 px-4 py-2 rounded text-center font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="border-2 border-white px-4 py-2 rounded text-center font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
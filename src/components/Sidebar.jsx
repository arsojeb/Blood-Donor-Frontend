import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaClipboardList,
  FaDonate,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebas.config";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  //Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMobileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Menu items
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Profile", icon: <FaUser />, path: "/dashboard/profile" },
  ];

  if (user?.role === "admin") {
    menuItems.push(
      { name: "All Users", icon: <FaUsers />, path: "/dashboard/all-users" },
      {
        name: "All Donation Requests",
        icon: <FaClipboardList />,
        path: "/dashboard/all-blood-donation-request",
      },
      { name: "Funding", icon: <FaDonate />, path: "/dashboard/funding" }
    );
  }

  if (user?.role === "volunteer") {
    menuItems.push({
      name: "All Donation Requests",
      icon: <FaClipboardList />,
      path: "/dashboard/all-blood-donation-request",
    });
  }

  if (user?.role === "donor") {
    menuItems.push(
      {
        name: "My Donation Requests",
        icon: <FaClipboardList />,
        path: "/dashboard/my-donation-requests",
      },
      {
        name: "Create Donation Request",
        icon: <FaClipboardList />,
        path: "/dashboard/create-donation-request",
      },
      { name: "Funding", icon: <FaDonate />, path: "/dashboard/funding" }
    );
  }

  const sidebarContent = (
    <div
      className={`flex flex-col bg-white shadow-lg h-full transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && (
          <Link
            to="/"
            className="font-bold text-lg text-red-600 hover:text-red-700"
          >
            Blood Donation
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="hidden md:block text-gray-600 hover:text-red-600"
        >
          {isOpen ? "«" : "»"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center p-2 mb-2 rounded transition ${
              location.pathname.startsWith(item.path)
                ? "bg-red-200 font-semibold"
                : "text-gray-700 hover:bg-red-100"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-gray-700 hover:bg-red-100 rounded"
        >
          <FaSignOutAlt />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white shadow p-4">
        <Link to="/" className="font-bold text-red-600">
          Blood Donation
        </Link>
        <button onClick={toggleMobile}>
          <FaBars className="text-xl text-gray-700" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen">{sidebarContent}</div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/"
              onClick={toggleMobile}
              className="font-bold text-lg text-red-600"
            >
              Blood Donation
            </Link>
            <button onClick={toggleMobile} className="text-xl">
              ×
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={toggleMobile}
                className={`flex items-center p-2 rounded transition ${
                  location.pathname.startsWith(item.path)
                    ? "bg-red-200 font-semibold"
                    : "hover:bg-red-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center p-2 mt-4 hover:bg-red-100 rounded"
            >
              <FaSignOutAlt />
              <span className="ml-3">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Overlay Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:static md:translate-x-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile */}
        <div className="md:hidden bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-red-600">Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? "✖" : "☰"}
          </button>
        </div>

        <main className="flex-1 p-6 mt-0 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

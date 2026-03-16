import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <Sidebar user={user} onClose={closeSidebar} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* Mobile Topbar */}
        <div className="md:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-red-600">
            Blood Donation
          </h1>

          <button
            onClick={toggleSidebar}
            className="text-2xl text-gray-700"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
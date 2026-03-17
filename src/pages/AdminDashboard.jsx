import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaUsers, FaDonate, FaTint, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRequests: 0,
    totalFunding: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin-stats");

        const data = res.data || {};

        setStats({
          totalDonors: data.totalDonors || 0,
          totalRequests: data.totalRequests || 0,
          totalFunding: data.totalFunding || 0,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: <FaUsers />,
      iconBg: "bg-blue-100 text-blue-600",
      link: "/dashboard/all-users",
      linkLabel: "Manage Users",
    },
    {
      title: "Blood Requests",
      value: stats.totalRequests,
      icon: <FaTint />,
      iconBg: "bg-red-100 text-red-600",
      link: "/dashboard/all-blood-donation-request",
      linkLabel: "View Requests",
    },
    {
      title: "Total Funding",
      value: `৳${stats.totalFunding}`,
      icon: <FaDonate />,
      iconBg: "bg-green-100 text-green-600",
      link: "/dashboard/funding",
      linkLabel: "View Funding",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="bg-white shadow-sm border rounded-xl p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back! Here is an overview of your blood donation platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group bg-white border rounded-xl p-6 shadow-sm hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between">

              {/* Text */}
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {card.value}
                </h2>
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-lg text-2xl ${card.iconBg}`}
              >
                {card.icon}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition">
              {card.linkLabel}
              <FaArrowRight className="ml-2 text-xs" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
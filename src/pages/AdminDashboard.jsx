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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: <FaUsers className="text-4xl text-blue-500" />,
      link: "/dashboard/all-users",
      linkLabel: "View All Users",
    },
    {
      title: "Blood Donation Requests",
      value: stats.totalRequests,
      icon: <FaTint className="text-4xl text-red-500" />,
      link: "/dashboard/all-blood-donation-request",
      linkLabel: "View Requests",
    },
    {
      title: "Total Funding",
      value: `৳${stats.totalFunding}`,
      icon: <FaDonate className="text-4xl text-green-500" />,
      link: "/dashboard/funding",
      linkLabel: "View Funding",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-red-600">Welcome, Admin!</h1>
        <p className="text-gray-600">
          Here’s a quick overview of your platform statistics. Click on the cards to manage users, donations, or funding.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div>{card.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{card.value}</h2>
                <p className="text-gray-500">{card.title}</p>
              </div>
            </div>
            <div className="text-blue-600 font-semibold flex items-center gap-2 hover:underline">
              <span>{card.linkLabel}</span>
              <FaArrowRight />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { FaUserFriends, FaHeartbeat, FaMoneyBillWave } from "react-icons/fa";

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRequests: 0,
    totalFunding: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.role !== "donor") {
      const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
          const res = await API.get("/dashboard/stats"); // your backend endpoint
          setStats(res.data);
        } catch (err) {
          console.error("Stats fetch failed:", err.message);

          // fallback dummy data if endpoint fails
          setStats({
            totalDonors: 120,
            totalRequests: 45,
            totalFunding: 5000,
          });

          setError(
            "Could not load stats from server. Showing fallback data."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    } else {
      // Donors don't need stats
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user?.name} 👋
      </h1>

      {user.role !== "donor" && (
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-3 text-center text-gray-500">
              Loading stats...
            </p>
          ) : error ? (
            <p className="col-span-3 text-center text-red-600">{error}</p>
          ) : null}

          <StatCard
            title="Total Donors"
            value={stats.totalDonors}
            icon={<FaUserFriends className="text-red-600 w-6 h-6" />}
          />
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={<FaHeartbeat className="text-red-600 w-6 h-6" />}
          />
          <StatCard
            title="Total Funding"
            value={`$${stats.totalFunding.toLocaleString()}`}
            icon={<FaMoneyBillWave className="text-green-600 w-6 h-6" />}
          />
        </div>
      )}

      {user.role === "donor" && (
        <p className="text-gray-600 mt-4">
          Thank you for supporting blood donations! ❤️
        </p>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between">
      <div>
        <h2 className="text-gray-500">{title}</h2>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

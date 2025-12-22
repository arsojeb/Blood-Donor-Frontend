import { useAuth } from "../context/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name} 👋
      </h1>

      {user.role !== "donor" && (
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard title="Total Donors" />
          <StatCard title="Total Requests" />
          <StatCard title="Total Funding" />
        </div>
      )}
    </div>
  );
}

function StatCard({ title }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-2xl font-bold">0</p>
    </div>
  );
}

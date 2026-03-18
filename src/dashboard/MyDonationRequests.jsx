import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function MyRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;
  const [total, setTotal] = useState(0);

  // Filter
  const [statusFilter, setStatusFilter] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/my-donation-requests", {
          params: {
            page,
            limit,
            status: statusFilter || undefined,
          },
        });

        setRequests(data?.result || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page, statusFilter]);

  /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const totalPages = Math.ceil(total / limit);

  /* ---------------- STATUS BADGE ---------------- */
  const getStatusBadge = (status = "") => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      done: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      canceled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return map[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Welcome message using user */}
      <h2 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
        Welcome, {user?.name || "Guest"}!
      </h2>

      <h2 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-500">
        🩸 My Donation Requests
      </h2>

      {/* Filter & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>

        <div className="flex gap-4 text-sm">
          {loading && <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>}
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>

      {/* Empty State */}
      {!loading && requests.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          No donation requests found.
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((r) => (
          <div
            key={r?._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-3 text-red-600 dark:text-red-500 border-b border-gray-100 dark:border-gray-700 pb-2">
                {r?.bloodGroup} Blood Request
              </h3>

              <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">Recipient:</span>{" "}
                  {r?.recipientName}
                </p>
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">Hospital:</span>{" "}
                  {r?.hospital}
                </p>
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">District:</span>{" "}
                  {r?.district}
                </p>
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">Upazila:</span>{" "}
                  {r?.upazila || "N/A"}
                </p>
              </div>
            </div>

            <p className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(
                  r?.status
                )}`}
              >
                {r?.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              disabled={p === page}
              className={`px-4 py-2 rounded-lg border transition font-medium ${
                p === page
                  ? "bg-red-600 text-white border-red-600 cursor-default"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
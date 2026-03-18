import { useEffect, useState } from "react";
import API from "../api/axios";

export default function UserDashboard() {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;
  const [total, setTotal] = useState(0);

  // Status filter
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch user donation requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        setError("");
        const res = await API.get("/my-donation-requests", {
          params: { page, limit, status: statusFilter || undefined },
        });
        setRequests(res.data?.result || []);
        setTotal(res.data?.total || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load donation requests.");
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [page, statusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 space-y-8">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 rounded-xl p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Wellcome to Your Dashboard!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          This is a Quick Overview of your requests.
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
        </select>
      </div>

      {/* Loading & Error */}
      {loadingRequests && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p className="animate-pulse">Loading requests...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl">
          {error}
        </div>
      )}

      {/* Requests Grid */}
      {!loadingRequests && requests.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          <p>No donation requests found.</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((r) => (
          <div
            key={r._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-500">
                  {r.bloodGroup} Blood
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(r.status)}`}>
                  {r.status}
                </span>
              </div>

              <div className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                <p><span className="font-medium">Recipient:</span> {r.recipientName}</p>
                <p><span className="font-medium">Hospital:</span> {r.hospital}</p>
                <p><span className="font-medium">Location:</span> {r.district}, {r.upazila || "N/A"}</p>
              </div>
            </div>
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

// Status badge helper
function getStatusBadge(status = "") {
  const map = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    done: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    canceled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };
  return map[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
}
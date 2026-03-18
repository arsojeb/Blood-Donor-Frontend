import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaArrowRight, FaTint } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingIds, setApprovingIds] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;
  const [total, setTotal] = useState(0);

  // Filter
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch all donation requests
  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/donation-requests", {
        params: { page, limit, status: statusFilter || undefined },
      });
      setRequests(res.data.result || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  // Approve a request
  const approveRequest = async (id) => {
    setApprovingIds((prev) => [...prev, id]);
    try {
      await API.patch(`/donation-requests/status/${id}`, { status: "inprogress" });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: "inprogress" } : req))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve request.");
    } finally {
      setApprovingIds((prev) => prev.filter((reqId) => reqId !== id));
    }
  };

  // Status badge
  const getStatusBadge = (status = "") => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      done: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      canceled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return map[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-red-600 dark:text-red-500">
        All Blood Donation Requests
      </h2>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
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

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p className="animate-pulse">Loading donation requests...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && !error && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
          No donation requests found.
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3 mb-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-500">
                  {req.bloodGroup} Blood
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(req.status)}`}>
                  {req.status}
                </span>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p><span className="font-semibold">Recipient:</span> {req.recipientName}</p>
                <p><span className="font-semibold">Location:</span> {req.district}, {req.upazila}</p>
                <p><span className="font-semibold">Date:</span> {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to={`/donation/${req._id}`}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-center py-2 rounded font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                View Details <FaArrowRight className="inline ml-2 text-xs" />
              </Link>

              {req.status === "pending" && (
                <button
                  onClick={() => approveRequest(req._id)}
                  disabled={approvingIds.includes(req._id)}
                  className={`w-full py-2 rounded font-semibold transition ${
                    approvingIds.includes(req._id)
                      ? "bg-green-400 dark:bg-green-800 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
                  }`}
                >
                  {approvingIds.includes(req._id) ? "Approving..." : "Approve Request"}
                </button>
              )}
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
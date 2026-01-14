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
      pending: "bg-yellow-100 text-yellow-800",
      inprogress: "bg-blue-100 text-blue-800",
      done: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-red-600">
        🩸 My Donation Requests
      </h2>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <select
          className="border rounded px-3 py-2 w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Empty State */}
      {!loading && requests.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          No donation requests found.
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((r) => (
          <div
            key={r?._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                {r?.bloodGroup} Blood Request
              </h3>

              <p>
                <span className="font-semibold">Recipient:</span>{" "}
                {r?.recipientName}
              </p>
              <p>
                <span className="font-semibold">Hospital:</span>{" "}
                {r?.hospital}
              </p>
              <p>
                <span className="font-semibold">District:</span>{" "}
                {r?.district}
              </p>
              <p>
                <span className="font-semibold">Upazila:</span>{" "}
                {r?.upazila || "N/A"}
              </p>
            </div>

            <p className="mt-4">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                  r?.status
                )}`}
              >
                {r?.status?.toUpperCase()}
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
              className={`px-3 py-1 rounded border transition ${
                p === page
                  ? "bg-red-600 text-white cursor-default"
                  : "bg-white hover:bg-red-500 hover:text-white"
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

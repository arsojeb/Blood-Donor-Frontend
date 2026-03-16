import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function MyRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const { data } = await API.get("/my-donation-requests");

        setRequests(data.result || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your donation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "approved") return "bg-green-100 text-green-800";
    if (status === "rejected") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-6 text-red-600">
        My Donation Requests
      </h2>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading your requests...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {/* Empty */}
      {!loading && !error && requests.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          You haven't created any blood requests yet.
        </div>
      )}

      {/* Requests */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {requests.map((r) => (
          <div
            key={r._id}
            className="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition"
          >

            {/* Blood Group */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-red-600">
                {r.bloodGroup}
              </span>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                  r.status
                )}`}
              >
                {r.status}
              </span>
            </div>

            {/* Recipient */}
            <p className="text-sm">
              <span className="font-semibold">Recipient:</span>{" "}
              {r.recipientName}
            </p>

            {/* Hospital */}
            <p className="text-sm">
              <span className="font-semibold">Hospital:</span>{" "}
              {r.hospital}
            </p>

            {/* Location */}
            <p className="text-sm">
              <span className="font-semibold">District:</span>{" "}
              {r.district}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Upazila:</span>{" "}
              {r.upazila || "N/A"}
            </p>

            {/* Date */}
            {r.createdAt && (
              <p className="text-xs text-gray-400 mt-3">
                Created: {new Date(r.createdAt).toLocaleDateString()}
              </p>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}
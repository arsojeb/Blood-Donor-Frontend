import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/my-donation-requests");
        setRequests(data.result || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-red-600">My Donation Requests</h2>

      {loading && <p className="text-gray-500">Loading your requests...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && requests.length === 0 && (
        <p className="text-gray-500">You have no donation requests yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {requests.map((r) => (
          <div
            key={r._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              {r.bloodGroup} Blood Request
            </h3>
            <p>
              <span className="font-semibold">Recipient:</span> {r.recipientName}
            </p>
            <p>
              <span className="font-semibold">Hospital:</span> {r.hospital}
            </p>
            <p>
              <span className="font-semibold">District:</span> {r.district}
            </p>
            <p>
              <span className="font-semibold">Upazila:</span> {r.upazila || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  r.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : r.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

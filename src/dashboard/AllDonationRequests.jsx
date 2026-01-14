import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function AllDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingIds, setApprovingIds] = useState([]); // track buttons being clicked

  const token = localStorage.getItem("token");

  // Fetch all donation requests
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/donation-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.result || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve a request
  const approveRequest = async (id) => {
    setApprovingIds((prev) => [...prev, id]);
    try {
      await API.patch(
        `/donation-requests/status/${id}`,
        { status: "inprogress" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI: update status without refetch
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "inprogress" } : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve request.");
    } finally {
      setApprovingIds((prev) => prev.filter((reqId) => reqId !== id));
    }
  };

  if (loading)
    return <p className="text-center mt-6">Loading donation requests...</p>;
  if (error)
    return (
      <p className="text-center mt-6 text-red-600">
        {error}
      </p>
    );
  if (!requests.length)
    return <p className="text-center mt-6">No donation requests found.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-red-600">
        All Blood Donation Requests
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border rounded p-4 shadow hover:shadow-lg bg-white flex flex-col justify-between"
          >
            <div className="space-y-1">
              <p>
                <strong>Recipient:</strong> {req.recipientName}
              </p>
              <p>
                <strong>Location:</strong> {req.district}, {req.upazila}
              </p>
              <p>
                <strong>Blood Group:</strong> {req.bloodGroup}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    req.status === "pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {req.status}
                </span>
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(req.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to={`/donation/${req._id}`}
                className="bg-red-600 text-white text-center py-2 rounded hover:bg-red-700"
              >
                View
              </Link>

              {req.status === "pending" && (
                <button
                  onClick={() => approveRequest(req._id)}
                  disabled={approvingIds.includes(req._id)}
                  className={`${
                    approvingIds.includes(req._id)
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white py-2 rounded`}
                >
                  {approvingIds.includes(req._id) ? "Approving..." : "Approve"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

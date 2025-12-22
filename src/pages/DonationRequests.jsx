import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function DonationRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await API.get("/pending-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (data.length === 0)
    return <p className="text-center mt-6">No pending donation requests.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((d) => (
        <div
          key={d._id}
          className="border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col justify-between"
        >
          <div className="mb-4 space-y-1">
            <p>
              <span className="font-semibold">Recipient:</span>{" "}
              {d.recipientName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {d.district}, {d.upazila || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span> {d.bloodGroup}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(d.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {new Date(d.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Link
            to={`/donation/${d._id}`}
            className="bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            View
          </Link>
        </div>
      ))}
    </div>
  );
}

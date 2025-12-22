import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function DonationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/donation/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load donation request.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDonate = async () => {
    try {
      await API.patch(`/donation-requests/status/${id}`, {
        status: "inprogress",
      });
      setData((prev) => ({ ...prev, status: "inprogress" }));
      setShowModal(false);
      alert("Donation confirmed!");
    } catch (err) {
      console.error(err);
      alert("Failed to confirm donation.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-red-600">{data.recipientName}</h2>
      <p>
        <span className="font-semibold">Hospital:</span> {data.hospital}
      </p>
      <p>
        <span className="font-semibold">District:</span> {data.district}
      </p>
      <p>
        <span className="font-semibold">Upazila:</span> {data.upazila || "N/A"}
      </p>
      <p>
        <span className="font-semibold">Blood Group:</span> {data.bloodGroup}
      </p>
      <p>
        <span className="font-semibold">Status:</span>{" "}
        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
      </p>
      {data.notes && (
        <p>
          <span className="font-semibold">Notes:</span> {data.notes}
        </p>
      )}

      {data.status === "pending" && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Donate
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-red-600">Confirm Donation</h3>
            <div className="space-y-2">
              <div>
                <label className="block font-semibold">Donor Name</label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Donor Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

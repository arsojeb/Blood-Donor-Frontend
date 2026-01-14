import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createDonationRequest } from "../api/donation.api";

export default function CreateDonationRequest() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (user?.status === "blocked") {
      setError("You are blocked by admin and cannot create requests.");
      return;
    }

    const formData = Object.fromEntries(new FormData(e.target));

    if (!formData.recipientName || !formData.hospital) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      await createDonationRequest({
        ...formData,
        requesterEmail: user.email,
        requesterName: user.name || "Anonymous",
      });

      setSuccess("Donation request created successfully.");
      e.target.reset();
    } catch (err) {
      setError("Failed to create donation request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create Blood Donation Request
      </h2>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-4 text-green-600 bg-green-50 px-4 py-2 rounded">
          {success}
        </div>
      )}

      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Recipient Name
          </label>
          <input
            name="recipientName"
            type="text"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-red-200"
            placeholder="Enter recipient name"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Hospital Name
          </label>
          <input
            name="hospital"
            type="text"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-red-200"
            placeholder="Enter hospital name"
            required
          />
        </div>

        <button
          disabled={loading}
          className="bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Blood"}
        </button>
      </form>
    </div>
  );
}

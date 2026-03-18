import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createDonationRequest } from "../api/donation.api";

import districtsJson from "../Json/division.json";
import upazilasJson from "../Json/upazilas.json";

export default function CreateDonationRequest() {
  const { user } = useAuth();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Extract real data from phpMyAdmin JSON export
  const districtData =
    districtsJson.find((item) => item.type === "table")?.data || [];

  const upazilaData =
    upazilasJson.find((item) => item.type === "table")?.data || [];

  // Filter upazilas based on district
  const filteredUpazilas = upazilaData.filter(
    (u) => u.district_id === selectedDistrict
  );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (user?.status === "blocked") {
      setError("You are blocked by admin and cannot create requests.");
      return;
    }

    const formData = Object.fromEntries(new FormData(e.target));

    if (
      !formData.recipientName ||
      !formData.hospital ||
      !formData.bloodGroup ||
      !formData.district ||
      !formData.upazila
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Map district ID to name
      const districtObj = districtData.find(d => d.id === formData.district);
      const districtName = districtObj ? districtObj.name : formData.district;

      await createDonationRequest({
        ...formData,
        district: districtName,          // send name instead of number
        requesterEmail: user.email,
        requesterName: user.name || "Anonymous",
      });

      setSuccess("Donation request created successfully.");

      e.target.reset();
      setSelectedDistrict("");
      setSelectedUpazila("");

    } catch (err) {
      console.error(err);
      setError("Failed to create donation request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Blood Donation Request
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={submit} className="grid gap-4">

          {/* Recipient Name */}
          <input
            name="recipientName"
            placeholder="Recipient Name"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          />

          {/* Hospital Name */}
          <input
            name="hospital"
            placeholder="Hospital Name"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          />

          {/* Blood Group */}
          <select
            name="bloodGroup"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* District */}
          <select
            name="district"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedUpazila("");
            }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          >
            <option value="">Select District</option>
            {districtData.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Upazila */}
          <select
            name="upazila"
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition disabled:opacity-50"
            disabled={!selectedDistrict}
            required
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition disabled:opacity-50 shadow-md mt-2"
          >
            {loading ? "Submitting..." : "Request Blood"}
          </button>
        </form>
      </div>
    </div>
  );
}
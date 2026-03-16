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
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Blood Donation Request
      </h2>

      {error && (
        <div className="text-red-600 bg-red-50 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 bg-green-50 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={submit} className="grid gap-4">

        {/* Recipient Name */}
        <input
          name="recipientName"
          placeholder="Recipient Name"
          className="border px-4 py-2 rounded"
          required
        />

        {/* Hospital Name */}
        <input
          name="hospital"
          placeholder="Hospital Name"
          className="border px-4 py-2 rounded"
          required
        />

        {/* Blood Group */}
        <select
          name="bloodGroup"
          className="border px-4 py-2 rounded"
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
          className="border px-4 py-2 rounded"
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
          className="border px-4 py-2 rounded"
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
          disabled={loading}
          className="bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Blood"}
        </button>
      </form>
    </div>
  );
}
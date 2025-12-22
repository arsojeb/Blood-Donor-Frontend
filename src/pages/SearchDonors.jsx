import { useState } from "react";
import API from "../api/axios";
import divisionsJSON from "../Json/division.json";
import upazilasJSON from "../Json/upazilas.json";

export default function SearchDonors() {
   const divisions = divisionsJSON[2].data;
    const upazilas = upazilasJSON[2].data;

  const [query, setQuery] = useState({ bloodGroup: "", district: "", upazila: "" });
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setQuery({ ...query, district, upazila: "" });

    // Filter upazilas for selected district
    const filtered = upazilas.filter((u) => u.district === district);
    setFilteredUpazilas(filtered);
  };

  const search = async () => {
    setLoading(true);
    setError(null);
    setDonors([]);
    try {
      const { data } = await API.get("/search-donors", { params: query });
      setDonors(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-red-600"> Search Donors</h1>

      {/* Search Form */}
      <div className="flex flex-col gap-3 mb-4">
        <select
          name="bloodGroup"
          value={query.bloodGroup}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <select
          name="district"
          value={query.district}
          onChange={handleDistrictChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select District</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="upazila"
          value={query.upazila}
          onChange={handleChange}
          disabled={!query.district}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          onClick={search}
          disabled={loading}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Donors List */}
      {donors.length > 0 && (
        <div className="grid gap-2">
          {donors.map((d) => (
            <div key={d._id} className="border p-2 rounded bg-white shadow-sm">
              <p><strong>Email:</strong> {d.email}</p>
              <p><strong>Blood Group:</strong> {d.bloodGroup}</p>
              <p><strong>District:</strong> {d.district}</p>
              {d.upazila && <p><strong>Upazila:</strong> {d.upazila}</p>}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && donors.length === 0 && <p>No donors found.</p>}
    </div>
  );
}

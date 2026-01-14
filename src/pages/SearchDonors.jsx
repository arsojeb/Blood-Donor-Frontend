import { useState } from "react";
import API from "../api/axios";
import divisionsJSON from "../Json/division.json";
import upazilasJSON from "../Json/upazilas.json";

export default function SearchDonors() {
  // ================== DATA ==================
  const districts = divisionsJSON.flatMap(div => div.data || []);
  const upazilas = upazilasJSON.flatMap(dist => dist.data || []);

  // ================== STATE ==================
  const [query, setQuery] = useState({
    bloodGroup: "",
    district: "", // districtId
    upazila: "",
  });

  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // ================== HANDLERS ==================
  const handleChange = (e) => {
    setError("");
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setError("");
    setQuery({ ...query, district: districtId, upazila: "" });

    if (!districtId) {
      setFilteredUpazilas([]);
      return;
    }

    // ✅ Correct filter based on JSON structure
    const filtered = upazilas.filter(u => u.district_id === districtId);
    setFilteredUpazilas(filtered);
  };

  // ================== SEARCH ==================
  const search = async () => {
    if (!query.bloodGroup || !query.district) {
      setError("Blood group and district are required.");
      return;
    }

    setLoading(true);
    setError("");
    setDonors([]);
    setSearched(true);

    try {
      const params = {
        bloodGroup: query.bloodGroup,
        districtId: query.district,
        upazila: query.upazila || undefined,
      };

      console.log("Search params:", params); // debug

      const { data } = await API.get("/search-donors", { params });
      setDonors(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          🩸 Search Blood Donors
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Blood Group */}
          <select
            name="bloodGroup"
            value={query.bloodGroup}
            onChange={handleChange}
            className="input"
          >
            <option value="">Blood Group</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* District */}
          <select
            name="district"
            value={query.district}
            onChange={handleDistrictChange}
            className="input"
          >
            <option value="">District</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Upazila */}
          <select
            name="upazila"
            value={query.upazila}
            onChange={handleChange}
            disabled={!query.district}
            className={`input ${!query.district ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">Upazila (optional)</option>
            {filteredUpazilas.map(u => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>

          {/* Search Button */}
          <button
            onClick={search}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search Donors"}
          </button>
        </div>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* RESULTS */}
        <div className="space-y-4">
          {donors.map(d => (
            <div
              key={d._id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="font-bold text-red-600 text-lg">{d.bloodGroup}</p>
              <p className="text-sm text-gray-600">{d.email}</p>
              <p className="text-sm">{d.districtName}{d.upazila && `, ${d.upazila}`}</p>
            </div>
          ))}
        </div>

        {searched && !loading && donors.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No donors found.</p>
        )}
      </div>

      <style>{`
        .input {
          border: 1px solid #e5e7eb;
          padding: 0.65rem;
          border-radius: 0.5rem;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 1px #dc2626;
        }
      `}</style>
    </div>
  );
}

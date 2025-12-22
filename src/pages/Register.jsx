import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import divisionsJSON from "../Json/division.json";
import upazilasJSON from "../Json/upazilas.json";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const divisions = divisionsJSON[2].data;
  const upazilas = upazilasJSON[2].data;

  const [form, setForm] = useState({
    email: "",
    name: "",
    avatar: "",
    bloodGroup: "",
    districtId: "",
    upazila: "",
    role: "donor",
    password: "",
    confirm_password: "",
    contact: "",
  });

  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setForm({ ...form, districtId, upazila: "" });
    const filtered = upazilas.filter((u) => u.district_id === districtId);
    setFilteredUpazilas(filtered);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const apiKey = "YOUR_IMAGEBB_API_KEY";
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
      setForm({ ...form, avatar: response.data.data.url });
    } catch (err) {
      console.error(err);
      setError("Avatar upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (
      !form.email ||
      !form.name ||
      !form.bloodGroup ||
      !form.districtId ||
      !form.upazila ||
      !form.password ||
      !form.contact ||
      !form.role
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">🩸 Register</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="border px-3 py-2 rounded"
        />

        <label className="text-sm">Upload Avatar:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="border px-3 py-2 rounded"
        />
        {form.avatar && (
          <img
            src={form.avatar}
            alt="avatar"
            className="w-20 h-20 mt-2 rounded-full"
          />
        )}

        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          required
          className="border px-3 py-2 rounded"
        />

        <select
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          name="districtId"
          value={form.districtId}
          onChange={handleDistrictChange}
          required
          className="border px-3 py-2 rounded"
        >
          <option value="">Select District</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="upazila"
          value={form.upazila}
          onChange={handleChange}
          required
          disabled={!form.districtId}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Role</option>
          <option value="donor">Donor</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="confirm_password"
          value={form.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

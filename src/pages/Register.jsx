import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import divisionsJSON from "../Json/division.json";
import upazilasJSON from "../Json/upazilas.json";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const districts = divisionsJSON[2].data;
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // District → Upazila filter
  const handleDistrictChange = (e) => {
    const id = Number(e.target.value);

    setForm({ ...form, districtId: id, upazila: "" });

    const filtered = upazilas.filter(
      (u) => Number(u.district_id) === id
    );

    setFilteredUpazilas(filtered);
  };

  // Cloudinary Upload
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, avatar: url });
    } catch {
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Submit
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (form.password !== form.confirm_password) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const payload = {
        email: form.email,
        name: form.name,
        avatar:
          form.avatar ||
          "https://i.ibb.co/4pDNDk1/avatar.png",
        bloodGroup: form.bloodGroup,
        district: form.districtId,
        upazila: form.upazila,
        role: form.role,
        password: form.password,
        phone: form.contact,
      };

      await register(payload);

      setSuccess("Registration successful! Check your email.");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Registration failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        
        <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-6">
          🩸 Register
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-3 rounded mb-4 text-sm text-center animate-pulse">
            {success}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="input"
          />

          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email address"
            required
            className="input"
          />

          <input
            type="text"
            name="contact"
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="input"
          />

          {/* Avatar */}
          <input type="file" onChange={handleImage} className="input" />

          {/* Blood */}
          <select name="bloodGroup" onChange={handleChange} required className="input">
            <option value="">Select Blood Group</option>
            {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          {/* District */}
          <select onChange={handleDistrictChange} required className="input">
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Upazila */}
          <select name="upazila" onChange={handleChange} required className="input">
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id}>{u.name}</option>
            ))}
          </select>

          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            className="input"
          />

          <input
            type="password"
            name="confirm_password"
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 dark:hover:bg-red-500 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 dark:text-red-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <style>
        {`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          background: white;
          color: black;
          padding: 10px;
          border-radius: 6px;
        }
        .dark .input {
          background: #374151;
          color: white;
          border-color: #4b5563;
        }
        `}
      </style>
    </div>
  );
}
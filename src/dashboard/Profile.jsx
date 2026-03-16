import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

/* Example District + Upazila Data */
const districts = {
  Dhaka: ["Savar", "Dhamrai", "Keraniganj", "Nawabganj"],
  Chattogram: ["Patiya", "Rangunia", "Sitakunda", "Fatikchhari"],
  Khulna: ["Batiaghata", "Dacope", "Dumuria"],
  Rajshahi: ["Bagha", "Charghat", "Puthia"],
};

export default function Profile() {
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    district: user?.district || "",
    upazila: user?.upazila || "",
    bloodGroup: user?.bloodGroup || "",
    avatar: user?.avatar || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasChanges =
    JSON.stringify(form) !==
    JSON.stringify({
      name: user?.name || "",
      email: user?.email || "",
      district: user?.district || "",
      upazila: user?.upazila || "",
      bloodGroup: user?.bloodGroup || "",
      avatar: user?.avatar || "",
    });

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setForm({
      ...form,
      district,
      upazila: "", // reset upazila when district changes
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, avatar: file });
  };

  const save = async () => {
    if (!hasChanges) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("district", form.district);
      formData.append("upazila", form.upazila);
      formData.append("bloodGroup", form.bloodGroup);

      if (form.avatar instanceof File) {
        formData.append("avatar", form.avatar);
      }

      const res = await API.patch(`/users/profile/${user.email}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setEdit(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>

        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={save}
            disabled={!hasChanges || loading}
            className={`px-4 py-2 rounded text-white ${
              loading || !hasChanges
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={
              form.avatar instanceof File
                ? URL.createObjectURL(form.avatar)
                : form.avatar || "/default-avatar.png"
            }
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />

          {edit && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          )}
        </div>

        {/* Form */}
        <div className="flex-1 grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="font-semibold">Name</label>
            <input
              type="text"
              disabled={!edit}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              disabled
              value={form.email}
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* District */}
          <div>
            <label className="font-semibold">District</label>
            <select
              disabled={!edit}
              value={form.district}
              onChange={handleDistrictChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select District</option>
              {Object.keys(districts).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="font-semibold">Upazila</label>
            <select
              disabled={!edit || !form.district}
              value={form.upazila}
              onChange={(e) =>
                setForm({ ...form, upazila: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Upazila</option>
              {form.district &&
                districts[form.district].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="font-semibold">Blood Group</label>
            <select
              disabled={!edit}
              value={form.bloodGroup}
              onChange={(e) =>
                setForm({ ...form, bloodGroup: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

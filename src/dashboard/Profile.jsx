import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    district: user.district || "",
    upazila: user.upazila || "",
    bloodGroup: user.bloodGroup || "",
    avatar: user.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasChanges = JSON.stringify(form) !== JSON.stringify({
    name: user.name || "",
    email: user.email || "",
    district: user.district || "",
    upazila: user.upazila || "",
    bloodGroup: user.bloodGroup || "",
    avatar: user.avatar || "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar: reader.result });
    };
    reader.readAsDataURL(file);

    // for real backend upload, send FormData in save()
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

      // if avatar is changed and is a file, append it
      if (form.avatar && form.avatar instanceof File) {
        formData.append("avatar", form.avatar);
      }

      const res = await API.patch(`/users/profile/${user.email}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setEdit(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={save}
            disabled={loading || !hasChanges}
            className={`px-4 py-2 rounded text-white transition ${
              loading || !hasChanges
                ? "bg-gray-400 cursor-not-allowed"
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
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <img
            src={form.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />
          {edit && (
            <label className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setForm({ ...form, avatar: file });
                }}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Name", field: "name", type: "text" },
            { label: "Email", field: "email", type: "email", disabled: true },
            { label: "District", field: "district", type: "text" },
            { label: "Upazila", field: "upazila", type: "text" },
            { label: "Blood Group", field: "bloodGroup", type: "text" },
          ].map(({ label, field, type, disabled }) => (
            <div key={field}>
              <label className="block text-gray-700 font-semibold mb-1">
                {label}
              </label>
              <input
                type={type}
                disabled={disabled || !edit}
                value={form[field] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className={`w-full border rounded px-3 py-2 ${
                  disabled || !edit ? "bg-gray-100" : "bg-white"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

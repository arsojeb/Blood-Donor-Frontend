import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...user });

  const save = async () => {
    try {
      const res = await API.patch(`/users/profile/${user.email}`, form);
      setUser(res.data);
      setEdit(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={form.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />
        </div>

        {/* Form */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              disabled={!edit}
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${
                !edit ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={form.email || ""}
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              District
            </label>
            <input
              type="text"
              disabled={!edit}
              value={form.district || ""}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${
                !edit ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Upazila
            </label>
            <input
              type="text"
              disabled={!edit}
              value={form.upazila || ""}
              onChange={(e) => setForm({ ...form, upazila: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${
                !edit ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Blood Group
            </label>
            <input
              type="text"
              disabled={!edit}
              value={form.bloodGroup || ""}
              onChange={(e) =>
                setForm({ ...form, bloodGroup: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 ${
                !edit ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

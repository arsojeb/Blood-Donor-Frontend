import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    district: "",
    upazila: "",
    bloodGroup: "",
    avatar: "",
  });

  // Sync user data to form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const hasChanges = user
    ? JSON.stringify(form) !==
      JSON.stringify({
        name: user.name || "",
        email: user.email || "",
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        avatar: user.avatar || "",
      })
    : false;

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

  const resetForm = () => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        avatar: user.avatar || "",
      });
    }
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    setEdit(false);
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
      setForm(res.data); // Sync local form state with updated user data
      setEdit(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Safety check if user context is not ready
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h2>

          <div className="flex gap-2">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!hasChanges || loading}
                  className={`px-5 py-2 rounded-lg font-semibold text-white transition shadow-sm ${
                    loading || !hasChanges
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {error && <p className="text-red-600 dark:text-red-400 mb-4 text-center text-sm">{error}</p>}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  form.avatar instanceof File
                    ? URL.createObjectURL(form.avatar)
                    : form.avatar || "https://via.placeholder.com/150"
                }
                alt="avatar"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-md"
              />
            </div>

            {edit && (
              <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                disabled={!edit}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 transition ${
                  edit
                    ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    : "bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-800 dark:text-gray-200"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* District */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">District</label>
              <select
                disabled={!edit}
                value={form.district}
                onChange={handleDistrictChange}
                className={`w-full border rounded-lg px-4 py-2 transition ${
                  edit
                    ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    : "bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-800 dark:text-gray-200"
                }`}
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
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Upazila</label>
              <select
                disabled={!edit || !form.district}
                value={form.upazila}
                onChange={(e) => setForm({ ...form, upazila: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 transition ${
                  edit
                    ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
                    : "bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-800 dark:text-gray-200"
                }`}
              >
                <option value="">Select Upazila</option>
                {/* FIX: Added optional chaining ?. and fallback || [] to prevent crash */}
                {form.district &&
                  (districts[form.district] || []).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
              <select
                disabled={!edit}
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 transition ${
                  edit
                    ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    : "bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-800 dark:text-gray-200"
                }`}
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
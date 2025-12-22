import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaEllipsisV } from "react-icons/fa";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // User actions
  const handleAction = async (id, action) => {
    try {
      await API.patch(`/users/${id}/${action}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Action failed!");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-red-600 mb-6">👤 All Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Avatar</th>
              <th className="p-3 border text-left">Email</th>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Role</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 relative">
                <td className="p-3 border">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3 border">{u.email}</td>
                <td className="p-3 border">{u.name}</td>
                <td className="p-3 border capitalize">{u.role}</td>
                <td className="p-3 border capitalize">{u.status}</td>
                <td className="p-3 border relative">
                  <button
                    className="p-2 border rounded hover:bg-gray-100"
                    onClick={() =>
                      setOpenMenu(openMenu === u._id ? null : u._id)
                    }
                  >
                    <FaEllipsisV />
                  </button>

                  {/* Action Menu */}
                  {openMenu === u._id && (
                    <div className="absolute right-0 top-10 w-48 bg-white border rounded shadow-md z-10">
                      {u.status === "active" && (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleAction(u._id, "block")}
                        >
                          Block
                        </button>
                      )}
                      {u.status === "blocked" && (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleAction(u._id, "unblock")}
                        >
                          Unblock
                        </button>
                      )}
                      {u.role !== "volunteer" && (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleAction(u._id, "make-volunteer")}
                        >
                          Make Volunteer
                        </button>
                      )}
                      {u.role !== "admin" && (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleAction(u._id, "make-admin")}
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

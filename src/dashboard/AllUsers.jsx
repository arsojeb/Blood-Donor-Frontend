import { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import { FaEllipsisV } from "react-icons/fa";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [actionLoadingIds, setActionLoadingIds] = useState([]);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
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

  // Handle user actions
  const handleAction = async (id, action) => {
    setActionLoadingIds((prev) => [...prev, id]);
    try {
      await API.patch(`/users/${id}/${action}`);

      // Optimistic UI update
      setUsers((prev) =>
        prev.map((user) => {
          if (user._id !== id) return user;

          switch (action) {
            case "block":
              return { ...user, status: "blocked" };
            case "unblock":
              return { ...user, status: "active" };
            case "make-volunteer":
              return { ...user, role: "volunteer" };
            case "make-admin":
              return { ...user, role: "admin" };
            default:
              return user;
          }
        })
      );
    } catch (err) {
      console.error(err);
      alert("Action failed!");
    } finally {
      setActionLoadingIds((prev) => prev.filter((uid) => uid !== id));
      setOpenMenu(null); // close menu after action
    }
  };

  // Filtered & searched users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  if (loading)
    return <p className="text-center mt-6">Loading users...</p>;
  if (error)
    return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">👤 All Users</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
          <option value="donor">Donor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
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

                    {openMenu === u._id && (
                      <div className="absolute right-0 top-10 w-48 bg-white border rounded shadow-md z-10">
                        {u.status === "active" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              actionLoadingIds.includes(u._id)
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleAction(u._id, "block")}
                          >
                            {actionLoadingIds.includes(u._id)
                              ? "Processing..."
                              : "Block"}
                          </button>
                        )}
                        {u.status === "blocked" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              actionLoadingIds.includes(u._id)
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleAction(u._id, "unblock")}
                          >
                            {actionLoadingIds.includes(u._id)
                              ? "Processing..."
                              : "Unblock"}
                          </button>
                        )}
                        {u.role !== "volunteer" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              actionLoadingIds.includes(u._id)
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleAction(u._id, "make-volunteer")
                            }
                          >
                            {actionLoadingIds.includes(u._id)
                              ? "Processing..."
                              : "Make Volunteer"}
                          </button>
                        )}
                        {u.role !== "admin" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              actionLoadingIds.includes(u._id)
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleAction(u._id, "make-admin")}
                          >
                            {actionLoadingIds.includes(u._id)
                              ? "Processing..."
                              : "Make Admin"}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

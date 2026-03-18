import { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import { FaEllipsisV } from "react-icons/fa";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [actionLoadingIds, setActionLoadingIds] = useState([]);

  // Search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
      setUsers(data);
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

  // Handle actions
  const handleAction = async (id, action) => {
    setActionLoadingIds((prev) => [...prev, id]);

    try {
      await API.patch(`/users/${id}/${action}`);

      // Optimistic update
      setUsers((prev) =>
        prev.map((user) => {
          if (user._id !== id) return user;

          // Handle Role Changes
          if (action === "make-volunteer") return { ...user, role: "volunteer" };
          if (action === "make-admin") return { ...user, role: "admin" };
          if (action === "make-donor") return { ...user, role: "donor" }; // Added Make Donor

          // Handle Status Changes
          if (action === "block") return { ...user, status: "blocked" };
          if (action === "unblock") return { ...user, status: "active" };

          return user;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Action failed! Check if backend endpoint exists.");
    } finally {
      setActionLoadingIds((prev) => prev.filter((uid) => uid !== id));
      setOpenMenu(null);
    }
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user?.name?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter ? user?.role === roleFilter : true;
      const matchesStatus = statusFilter ? user?.status === statusFilter : true;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-6">
        👤 All Users
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
          <option value="donor">Donor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
        <table className="w-full min-w-[700px] bg-white dark:bg-gray-800 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Avatar</th>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Email</th>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Name</th>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Role</th>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id || u.email} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                  <td className="p-3">
                    {u?.avatar ? (
                      <img
                        src={u.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                        {u?.name?.charAt(0) || "N/A"}
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-gray-700 dark:text-gray-200">{u?.email || "N/A"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{u?.name || "N/A"}</td>
                  
                  <td className="p-3">
                    <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                      u?.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                      u?.role === 'volunteer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}>
                      {u?.role || "N/A"}
                    </span>
                  </td>

                  <td className="p-3">
                     <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                      u?.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {u?.status || "N/A"}
                    </span>
                  </td>

                  <td className="p-3 relative">
                    <button
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition"
                      onClick={() =>
                        setOpenMenu(openMenu === u._id ? null : u._id)
                      }
                    >
                      <FaEllipsisV />
                    </button>

                    {openMenu === u._id && (
                      <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl z-20 py-1">
                        
                        {/* Status Actions */}
                        {u?.status === "active" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                            onClick={() => handleAction(u._id, "block")}
                          >
                            Block User
                          </button>
                        )}

                        {u?.status === "blocked" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                            onClick={() => handleAction(u._id, "unblock")}
                          >
                            Unblock User
                          </button>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                        {/* Role Actions - Fixed Logic */}
                        
                        {/* Show 'Make Admin' if they are NOT already Admin */}
                        {u?.role !== "admin" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                            onClick={() => handleAction(u._id, "make-admin")}
                          >
                            Make Admin
                          </button>
                        )}

                        {/* Show 'Make Volunteer' if they are NOT already Volunteer */}
                        {u?.role !== "volunteer" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                            onClick={() => handleAction(u._id, "make-volunteer")}
                          >
                            Make Volunteer
                          </button>
                        )}

                        {/* Show 'Make Donor' if they are NOT already Donor */}
                        {u?.role !== "donor" && (
                          <button
                            disabled={actionLoadingIds.includes(u._id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                            onClick={() => handleAction(u._id, "make-donor")}
                          >
                            Make Donor
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
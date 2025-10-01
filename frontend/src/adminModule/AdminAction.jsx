import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AdminAction = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Cashier" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch("https://groovy-backend-km9g.onrender.com/api/stores/");
      const data = await res.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://groovy-backend-km9g.onrender.com/api/assign/all-users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://groovy-backend-km9g.onrender.com/api/assign/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create user");
        return;
      }

      setFormData({ name: "", email: "", role: "Cashier" });
      setEditId(null);
      toast.success(data.message || "User created successfully");

      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Something went wrong while creating the user.");
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditId(user._id || user.id);
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u._id === id || u.id === id);
    if (!user) {
      toast.error("User not found.");
      return;
    }

    const role = user.role.toLowerCase();

    if (window.confirm(`Are you sure you want to delete this ${user.role}?`)) {
      try {
        const res = await fetch(`https://groovy-backend-km9g.onrender.com/api/stores/delete/${role}/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to delete user");
          return;
        }

        toast.success(data.message || `${user.role} deleted successfully`);
        fetchUsers();
        fetchStores();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user.");
      }
    }
  };

  const handleAssignStore = async (userId, storeName) => {
    try {
      const selectedUser = users.find(u => u._id === userId || u.id === userId);
      const selectedStore = stores.find(s => s.storeName === storeName);

      if (!selectedUser || !selectedStore) {
        toast.error("Invalid user or store selected");
        return;
      }

      const payload = {
        storeId: selectedStore._id,
        [`${selectedUser.role.toLowerCase()}Id`]: userId,
      };

      const endpoint =
        selectedUser.role === "Manager"
          ? "https://groovy-backend-km9g.onrender.com/api/stores/assign-manager"
          : "https://groovy-backend-km9g.onrender.com/api/stores/assign-cashier";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to assign store");
        return;
      }

      toast.success(data.message || "Store assigned successfully");
      fetchUsers();
      fetchStores();
    } catch (error) {
      console.error("Error assigning store:", error);
      toast.error("An error occurred while assigning the store.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin - Manage Users & Assign Stores</h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleAddOrUpdate}
        className="bg-white p-4 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
        </select>
        <button type="submit" className="bg-teal-950 hover:bg-teal-900 text-white rounded px-4 py-2">
          {editId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Assigned Store</th>
              <th className="py-2 px-4 text-left">Assign</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id || user.id} className="border-t">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  {user.storeName || <span className="text-gray-400">Not Assigned</span>}
                </td>
                <td className="py-2 px-4">
                  <select
                    className="border rounded px-2 py-1"
                    value={user.storeName || ""}
                    onChange={(e) => handleAssignStore(user._id || user.id, e.target.value)}
                  >
                    <option value="">-- Select Store --</option>
                    {stores.map(store => (
                      <option key={store._id} value={store.storeName}>
                        {store.storeName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleDelete(user._id || user.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAction;

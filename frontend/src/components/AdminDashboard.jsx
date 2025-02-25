import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch user data.");
    }
  };

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/feedback");
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("Failed to fetch feedback data.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${id}`);
      alert(`User: ${name} deleted successfully.`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:8081/api/users/${id}`, updatedUser);
      alert(`User: ${res.data.name} updated successfully.`);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Users Table */}
      <div className="overflow-x-auto mb-10">
        <h2 className="text-xl font-bold mb-4">Users List</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Password</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleUpdateChange}
                      className="p-1 border rounded bg-gray-700 text-white"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="border p-2">
                  {editingUserId === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleUpdateChange}
                      className="p-1 border rounded bg-gray-700 text-white"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border p-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      name="password"
                      value={updatedUser.password}
                      onChange={handleUpdateChange}
                      className="p-1 border rounded bg-gray-700 text-white"
                    />
                  ) : (
                    user.password
                  )}
                </td>
                <td className="border p-2">
                  {editingUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">User Feedback</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback._id} className="text-center">
                  <td className="border p-2">{feedback.name}</td>
                  <td className="border p-2">{feedback.email}</td>
                  <td className="border p-2">{feedback.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border p-2 text-center text-gray-400">
                  No feedback available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

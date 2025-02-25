import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Redirect if no email found

const UpdateProfile = () => {
  const [user, setUser] = useState({ name: "", password: "" });
  const [storedEmail, setStoredEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("username");

    if (!email) {
      alert("No email found. Redirecting to login.");
      navigate("/login");
      return;
    }

    setStoredEmail(email);

    // Fetch user data for pre-filling form
    axios
      .get(`http://localhost:8081/api/users?email=${email}`)
      .then((res) => {
        if (res.data) {
          setUser({ name: res.data.name || "", password: "" });
        }
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:8081/api/update-profile/${storedEmail}`,
        { name: user.name, password: user.password },
        { headers: { "Content-Type": "application/json" } }
      );
      alert(res.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-400">Email (Read-Only)</label>
          <input type="email" value={storedEmail} readOnly className="w-full p-2 bg-gray-700 text-white rounded" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400">Name</label>
          <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400">New Password</label>
          <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;

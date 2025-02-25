import { useState, useEffect } from "react";
import axios from "axios";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setFormData((prevData) => ({ ...prevData, email: storedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/feedback", formData);
      alert(res.data.message);
      setFormData({ name: "", email: localStorage.getItem("username") || "", message: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-3xl text-center shadow-lg">
        {/* About Us Section */}
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">About Us</h1>
        <p className="text-gray-300 mb-6">
          Welcome to our platform! We are dedicated to providing a seamless and user-friendly experience for our users.
          Our mission is to connect people through innovative solutions, ensuring a smooth and engaging experience.
        </p>

        {/* Feedback Form */}
        <h2 className="text-xl font-bold text-yellow-500 mb-4">📝 Feedback Form</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="p-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            placeholder="Your Email (auto-filled)"
            className="p-2 bg-gray-800 text-gray-400 border border-gray-600 rounded-md cursor-not-allowed"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Feedback"
            required
            className="p-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button type="submit" className="bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-400 transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

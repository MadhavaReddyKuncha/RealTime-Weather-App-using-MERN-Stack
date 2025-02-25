import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Navbar";

const Signup = () => {
  const navigate = useNavigate();

  // State for form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/signup", {
        name,
        email,
        password,
      });
      alert(res.data.message);
      // Optionally, you can store the token if needed:
       localStorage.setItem("token", res.data.token);
      // Redirect to login page after a successful signup
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center font-sora gap-4 mt-60">
        <h1 className="font-sora text-white text-4xl md:text-5xl font-extrabold text-center select-none">
          Signup Page
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full md:w-[400px]">
          <input
            type="text"
            placeholder="Username"
            className="p-2 text-white rounded-md border-2 w-full border-gray-400 focus:border-gray-300 focus:outline-none transition-all duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 text-white rounded-md border-2 w-full border-gray-400 focus:border-gray-300 focus:outline-none transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 text-white rounded-md border-2 w-full border-gray-400 focus:border-gray-300 focus:outline-none transition-all duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-white text-black flex items-center justify-center px-4 py-2 rounded-md cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            SignUp
          </button>
        </form>
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link to="/login">
            <strong className="text-white cursor-pointer">Login</strong>
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Signup;

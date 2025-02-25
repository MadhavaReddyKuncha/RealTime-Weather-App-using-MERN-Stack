import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
      alert("Admin login successful!");
      navigate("/admin");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:8081/login", { email, password });
  
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", email);
      navigate("/five-day-forecast"); // Redirect to update profile
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center font-sora gap-4 mt-60">
      <h1 className="text-white text-4xl md:text-5xl font-extrabold text-center select-none">
        Login Page
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full md:w-[400px]">
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
          Login
        </button>
      </form>
      <p className="text-gray-400">
        Don&apos;t have an account?{" "}
        <Link to="/signup">
          <strong className="text-white cursor-pointer">Signup</strong>
        </Link>
      </p>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check for token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username")
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full bg-black text-white p-4 font-sora fixed top-0 left-0 shadow-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/state-temp">
            <h1 className="text-xl font-bold">Weather Forecast</h1>
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/five-day-forecast" className="hover:underline">Forecast</Link>
            {token ? (
              <>
                <Link to="/feedback" className="hover:underline">feedback</Link>
                <Link to="/update-profile" className="hover:underline">Update Profile</Link>
                <Link to="/weather-suggestion" className="hover:underline">Trip</Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 hover:underline bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/signup" className="hover:underline">Signup</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        <div
          className={`absolute mt-4 px-4 left-0 w-full bg-gray-50 rounded-md text-center overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-60 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <Link
            to="/"
            className="block text-black py-2 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/five-day-forecast"
            className="block text-black py-2 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Forecast
          </Link>
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="block text-black py-2 hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              {user && (
                <div className="block text-black py-2">
                  Hello, {user.name}
                </div>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block text-black py-2 hover:bg-gray-200 w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-black py-2 hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block text-black py-2 hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

      <div
        className={`p-4 flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? "mt-36" : "mt-16"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;

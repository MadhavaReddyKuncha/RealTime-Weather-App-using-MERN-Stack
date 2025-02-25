import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Navbar"; // your layout (navbar)
import Login from "./components/Login";
import Signup from "./components/Signup";
import Weather from "./components/Weather"; // Regular user dashboard
import FiveDayForecast from "./components/FiveDayForecast";
import AdminDashboard from "./components/AdminDashboard"; // Admin module
import IndianStateTemperature from "./components/IndianStateTemperature";
import UpdateProfile from "./components/UpdateProfile";
import WeatherSuggestion from "./components/WeatherSuggestion";
import FeedbackForm from "./components/FeedbackForm";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Weather />} />
          <Route path="/five-day-forecast" element={<FiveDayForecast />} />
          <Route path="/dashboard" element={<Weather />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/weather-suggestion" element={<WeatherSuggestion />} />
          <Route path="/feedback" element={< FeedbackForm />} />
          
          <Route path="/state-temp" element={<IndianStateTemperature />}/ >
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

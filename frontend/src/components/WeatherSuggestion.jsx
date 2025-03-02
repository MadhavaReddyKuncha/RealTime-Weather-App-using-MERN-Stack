import { useState, useEffect } from "react";
import axios from "axios";

const WeatherSuggestion = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const API_KEY = ""; // Replace with your OpenWeatherMap API Key

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setRecipientEmail(storedEmail);
    }
  }, []);

  const statesWithCities = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool"],
    "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const addCity = () => {
    if (selectedCity && !selectedCities.some((c) => c.name === selectedCity)) {
      setSelectedCities([...selectedCities, { name: selectedCity, date: "" }]);
    }
    setSelectedCity("");
  };

  const updateCityDate = (cityName, date) => {
    setSelectedCities(
      selectedCities.map((city) =>
        city.name === cityName ? { ...city, date } : city
      )
    );
  };

  const removeCity = (cityName) => {
    setSelectedCities(selectedCities.filter((city) => city.name !== cityName));
  };

  const getWeatherSuggestion = (weather) => {
    if (!weather || !weather.weather || weather.weather.length === 0) {
      return "🤔 Unable to determine weather conditions.";
    }

    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "🌞 Great weather! Perfect for sightseeing.";
    if (condition.includes("clouds")) return "☁️ Cloudy but good for travel.";
    if (condition.includes("rain")) return "🌧️ Carry an umbrella. Expect rain!";
    if (condition.includes("thunderstorm")) return "⛈️ Avoid travel. Thunderstorms expected!";
    if (condition.includes("snow")) return "❄️ Snowy conditions. Dress warmly!";

    return "🤔 Check local conditions before traveling.";
  };

  const fetchWeather = async () => {
    if (selectedCities.some(city => !city.date)) {
      alert("Please select a date for each city.");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData([]);

    try {
      const requests = selectedCities.map((city) =>
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`)
      );

      const responses = await Promise.all(requests);

      setWeatherData(responses.map((res, index) => ({
        city: selectedCities[index].name,
        date: selectedCities[index].date,
        weather: res.data,
        suggestion: getWeatherSuggestion(res.data),
      })));
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!recipientEmail) {
      alert("Email not found! Please log in again.");
      return;
    }
    if (weatherData.length === 0) {
      alert("Please get trip advice first.");
      return;
    }

    const requestBody = {
      recipientEmail,
      weatherData,
    };

    try {
      await axios.post(
        "http://localhost:8081/api/send-email",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(`Email sent successfully to ${recipientEmail}!`);
    } catch (err) {
      alert(`Failed to send email: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Multi-City Trip Planner 🌍</h1>

      {/* State Selection */}
      <div className="mb-4">
        <label className="block text-sm">Select State:</label>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="bg-gray-800 border border-gray-600 rounded px-4 py-2 mt-1"
        >
          <option value="">-- Select State --</option>
          {Object.keys(statesWithCities).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* City Selection */}
      {selectedState && (
        <div className="mb-4">
          <label className="block text-sm">Select City:</label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="bg-gray-800 border border-gray-600 rounded px-4 py-2 mt-1"
          >
            <option value="">-- Select City --</option>
            {statesWithCities[selectedState].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <button
            onClick={addCity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-2"
          >
            Add City
          </button>
        </div>
      )}

      {/* Selected Cities List */}
      <div className="mb-4">
        {selectedCities.map((city) => (
          <div key={city.name} className="flex items-center space-x-4 mb-2">
            <span>{city.name}</span>
            <input
              type="date"
              value={city.date}
              onChange={(e) => updateCityDate(city.name, e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            />
            <button
              onClick={() => removeCity(city.name)}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Get Trip Advice & Send Email Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={fetchWeather}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Get Trip Advice
        </button>
        <button
          onClick={sendEmail}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Send Email
        </button>
      </div>

      {/* Weather Results */}
      {loading && <p className="text-blue-400 mt-4">Loading weather data...</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}
      <div className="mt-4">
        {weatherData.map((data) => (
          <div key={data.city} className="p-4 border border-gray-600 rounded mb-2">
            <p><strong>{data.city} ({data.date})</strong></p>
            <p>Temperature: {data.weather.main.temp}°C</p>
            <p>Condition: {data.weather.weather[0].description}</p>
            <p>Suggestion: {data.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherSuggestion;

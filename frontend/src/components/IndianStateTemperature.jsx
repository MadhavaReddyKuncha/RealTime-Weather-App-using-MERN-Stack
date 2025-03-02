import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const IndianStateTemperature = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // List of Indian states with a representative city for each state.
  const states = [
    { state: "Delhi", city: "Delhi" },
    { state: "Maharashtra", city: "Mumbai" },
    { state: "Tamil Nadu", city: "Chennai" },
    { state: "West Bengal", city: "Kolkata" },
    { state: "Karnataka", city: "Bengaluru" },
    { state: "Telangana", city: "Hyderabad" },
    { state: "Gujarat", city: "Ahmedabad" },
    { state: "Punjab", city: "Chandigarh" },
  ];

  useEffect(() => {
    const fetchTemperatures = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const API_KEY = "Your api key";
        // Create an array of API requests for each state's city.
        const requests = states.map((item) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${item.city}&appid=${API_KEY}&units=metric`
          )
        );

        // Wait for all API requests to complete.
        const responses = await Promise.all(requests);
        // Map responses to include state info along with temperature and description.
        const results = responses.map((res, index) => ({
          ...states[index],
          temp: res.data.main.temp,
          description: res.data.weather[0].description,
        }));
        setData(results);
      } catch (err) {
        console.error("Error fetching temperatures:", err);
        setError("Failed to fetch temperature data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemperatures();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Indian State Temperature Today
      </h1>
      {isLoading ? (
        <ClipLoader size={50} color="#ffffff" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item) => (
            <div
              key={item.state}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {item.state}
              </h2>
              <p className="text-gray-600">City: {item.city}</p>
              <p className="text-lg text-gray-700">
                Temperature: {Math.round(item.temp)}°C
              </p>
              <p className="text-sm text-gray-500">
                Condition: {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndianStateTemperature;

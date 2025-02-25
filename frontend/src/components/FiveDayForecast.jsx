import { useEffect, useState } from "react";
import { fetchWeatherForecast } from "../services/WeatherService";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import Layout from "./Navbar";

const WeatherForecast = () => {
  const [city, setCity] = useState("Delhi");
  const [searchCity, setSearchCity] = useState("Delhi");
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  useEffect(() => {
    if (!searchCity) return;

    const getForecast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherForecast(searchCity);
        // Filter to one reading per day (every 8th reading)
        const dailyForecast = data.list.filter((_, index) => index % 8 === 0);
        setForecast(dailyForecast);
        console.log("Forecast data:", dailyForecast); // Debug log
      } catch (error) {
        console.error("Error fetching forecast:", error);
        setError("Unable to fetch forecast.");
      } finally {
        setIsLoading(false);
      }
    };

    getForecast();
  }, [searchCity]);

  // Function to get weather icons based on condition
  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny className="text-yellow-400 text-5xl" />;
      case "Clouds":
        return <WiCloudy className="text-gray-400 text-5xl" />;
      case "Rain":
        return <WiRain className="text-blue-400 text-5xl" />;
      case "Snow":
        return <WiSnow className="text-blue-200 text-5xl" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-purple-400 text-5xl" />;
      default:
        return <WiCloudy className="text-gray-400 text-5xl" />;
    }
  };

  // Handle city input change and fetch suggestions
  const handleCityChange = async (e) => {
    const inputValue = e.target.value;
    setCity(inputValue);

    if (inputValue.trim().length > 2) {
      try {
        const res = await axios.get("https://api.openweathermap.org/data/2.5/find", {
          params: {
            q: inputValue,
            appid: "b154513ca528fa4ab274895e75d91694", // Replace with your API key
            units: "metric",
            cnt: 5, // Use 'cnt' instead of 'limit'
          },
        });
        console.log("Suggestions:", res.data.list); // Debug log
        setSuggestions(res.data.list || []);
        setIsSuggestionsVisible(true);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  // When a suggestion is clicked, update the city and trigger search
  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setSearchCity(suggestion.name);
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  return (
    <>
    <Layout> 
      <h1 className="text-white">{localStorage.getItem("username")}</h1>
    <div className="mt-6 w-full font-sora max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">5-Day Forecast</h2>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-6 relative">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
          className="p-2 text-white rounded-md border-2 w-full md:w-[400px] bg-transparent border-gray-400 focus:border-gray-300 focus:outline-none transition-all duration-200"
        />
        <button
          onClick={() => setSearchCity(city)}
          className="bg-white text-black flex items-center justify-center px-4 py-2 rounded-md cursor-pointer select-none w-full md:w-auto"
        >
          {isLoading ? <ClipLoader size={20} color="#000000" /> : "Search"}
        </button>

        {/* Suggestions Dropdown */}
        {isSuggestionsVisible && suggestions.length > 0 && (
          <div className="absolute top-[40px] left-0 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 z-10">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 text-white cursor-pointer hover:bg-gray-700"
              >
                {suggestion.name}, {suggestion.sys.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forecast Results */}
      {isLoading ? (
        <p className="text-gray-50">Loading...</p>
      ) : error ? (
        <p className="text-gray-400">{error}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {forecast.length > 0 ? (
            forecast.map((day) => (
              <div
                key={day.dt}
                className="p-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shadow-md flex flex-col items-center justify-center text-white"
              >
                <p className="font-semibold text-lg">
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {getWeatherIcon(day.weather[0].main)}
                <p className="text-lg font-medium mt-2">{day.weather[0].main}</p>
                <p className="text-sm">Temp: {Math.round(day.main.temp)}°C</p>
                <p className="text-sm">Humidity: {day.main.humidity}%</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-2">
              Enter a city and press search.
            </p>
          )}
        </div>
      )}
    </div>
    </Layout>
    </>
  );
};

export default WeatherForecast;

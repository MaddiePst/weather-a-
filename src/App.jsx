import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import "./index.css";

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [city, setCity] = useState("Atlanta");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [futureWeatherData, setFutureWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("imperial");
  let forecastItems = [];
  const [inputValue, setInputValue] = useState("");

  // Get Current Location (when enter the website)
  const getLocation = () => {
    // Check if Geolocation API is available in the browser
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    // Request the user's location (latitude and longitude)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );
  };
  // console.log("Location: ", location);
  // console.log("City :", city);

  // Defining the current timezone
  // const dt = new Date();
  // console.log(dt);
  // const curTimezone = dt.getTimezoneOffset() / 60;
  // console.log("Timezone of the browser: ", curTimezone);
  // Set Lat and Lon on searched city
  const fetchCityWeather = async (cityName) => {
    if (!cityName) {
      // setError("City is not found");
      return;
    }
    console.log("CIty from fetchCityWeather: ", cityName);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=67263f61c34be6002f3dec2554277cb1`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log("Data fetchCityWeather(today): ", data);
    setLocation({
      latitude: data.coord.lat,
      longitude: data.coord.lon,
    });
    setCity(data.name);
    setError("Know");
    // search(location.latitude, location.longitude);
  };
  // console.log('fetchCityWeather: ', fetchCityWeather)

  const fetchWeatherByCoords = async (lat, lon) => {
    if (!lat || !lon) return;
    try {
      const resToday = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=67263f61c34be6002f3dec2554277cb1`
      );
      const today = await resToday.json();
      setWeatherData(today);
      console.log("Weather Data(today): ", today);
      setCity(today.name);

      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=67263f61c34be6002f3dec2554277cb1`
      );
      const forecast = await resForecast.json();
      setFutureWeatherData(forecast);
      // console.log("Forecast (futureWeatherData--forecast): ", forecast);
    } catch (err) {
      setError(err.message);
    }
  };
  // console.log("Forecast (futureWeatherData): ", futureWeatherData);

  const filterDataHourly = async () => {
    if (futureWeatherData?.list) {
      forecastItems = futureWeatherData.list.slice(0, 5).map((item) => {
        const dateObj = new Date(item.dt_txt);
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          dateObj.getDay()
        ];
        const monthName = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][dateObj.getMonth()];
        return {
          date: `${dayName}, ${dateObj.getDate()} ${monthName}`,
          time: `${dateObj.getHours()}:${
            dateObj.getMinutes() < 10 ? "0" : ""
          }${dateObj.getMinutes()}`,
          icon1: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          description: item.weather[0].main,
          temp: Math.round(item.main.temp),
          tempHigh: Math.round(item.main.temp_max),
          tempLow: Math.round(item.main.temp_min),
        };
      });
    }
  };
  filterDataHourly();
  // console.log("Forecast Items(byHour): ", forecastItems);

  // Re-render the website when the location changes of the units
  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchWeatherByCoords(location.latitude, location.longitude);
    }
  }, [location, units]);

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      fetchCityWeather(savedCity);
    }
  }, []);

  const handleKeyDown = (e) => {
    // setInputValue(e.target.value);
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setCity(inputValue);
      localStorage.setItem("lastCity", inputValue.trim());
      fetchCityWeather(inputValue.trim());
      console.log("City: ", city);
      setInputValue(" ");
    }
  };

  // Toggle dark mode
  function toggleDarkMode() {
    setIsDark((prevIsDark) => !prevIsDark);
  }
  // Set background color based on isDark
  document.querySelector("body").style.backgroundColor = isDark
    ? "#383838"
    : "  #9E9E9E";

  // Change units (imperial => metric)
  function handleUnits() {
    setUnits((prevUnits) => (prevUnits === "imperial" ? "metric" : "imperial"));
  }

  return (
    <div data-theme={isDark ? "dark" : "light"}>
      <Header
        inputValue={inputValue}
        toggleDarkMode={toggleDarkMode}
        onKeyDown={handleKeyDown}
        city={city}
        getLocation={getLocation}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Main
        isDark={isDark}
        city={city}
        forecastItems={forecastItems}
        weatherData={weatherData}
        futureWeatherData={futureWeatherData}
        handleUnits={handleUnits}
        units={units}
      />
    </div>
  );
};

export default App;

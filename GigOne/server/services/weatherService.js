const axios = require("axios");

const getWeatherContext = async (lat, lon) => {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    // Fetch both endpoints simultaneously for performance
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl)
    ]);

    // 1. Current Weather
    const currentData = currentRes.data;
    const current = {
      city: currentData.name,
      target_date: new Date().toISOString(),
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      condition: currentData.weather[0].main,
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      wind_speed: currentData.wind.speed,
    };

    // 2. Tomorrow's Weather
    const list = forecastRes.data.list;
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateString = tomorrowDate.toISOString().split("T")[0]; 

    // Find the first forecast block for tomorrow around 09:00:00
    let tomorrowForecast = list.find((item) => 
      item.dt_txt.startsWith(tomorrowDateString) && item.dt_txt.includes("09:00:00")
    );

    // Fallback: if 9 AM isn't there, just take the first block of tomorrow
    if (!tomorrowForecast) {
      tomorrowForecast = list.find((item) => item.dt_txt.startsWith(tomorrowDateString));
    }

    if (!tomorrowForecast) {
      throw new Error("Could not find tomorrow's forecast data.");
    }

    const tomorrow = {
      city: forecastRes.data.city.name,
      target_date: tomorrowForecast.dt_txt,
      temp: tomorrowForecast.main.temp,           
      feels_like: tomorrowForecast.main.feels_like,
      condition: tomorrowForecast.weather[0].main,
      description: tomorrowForecast.weather[0].description,
      humidity: tomorrowForecast.main.humidity,
      wind_speed: tomorrowForecast.wind.speed,
    };

    return { current, tomorrow };
  } catch (error) {
    if (error.response && error.response.status === 401) {
       console.log("OpenWeather API is still activating...");
       return { 
         current: { error: "Weather API key activating", condition: "Unknown" },
         tomorrow: { error: "Weather API key activating", condition: "Unknown" }
       };
    }
    throw error;
  }
};

module.exports = { getWeatherContext };

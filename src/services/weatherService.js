const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

const isMock = !API_KEY || API_KEY === 'your_api_key_here';

function mockCurrent(city) {
  return {
    name: city,
    sys: { country: 'IN' },
    main: { temp: 28.4, feels_like: 31.2, humidity: 72, pressure: 1012 },
    weather: [{ main: 'Clouds', description: 'partly cloudy', icon: '02d' }],
    wind: { speed: 4.2 },
    visibility: 9000,
  };
}

function mockForecast(city) {
  const base = Date.now();
  return {
    city: { name: city, country: 'IN' },
    list: [0, 1, 2, 3, 4].map((i) => ({
      dt_txt: new Date(base + i * 3 * 60 * 60 * 1000).toISOString(),
      main: { temp: 27 + i, feels_like: 30 + i, humidity: 70 + i },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 3 + i * 0.5 },
    })),
  };
}

async function getCurrentWeather(city) {
  if (isMock) return mockCurrent(city);
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: 'metric' },
    });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) return mockCurrent(city);
    throw err;
  }
}

async function getForecast(city) {
  if (isMock) return mockForecast(city);
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: API_KEY, units: 'metric' },
    });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) return mockForecast(city);
    throw err;
  }
}

module.exports = { getCurrentWeather, getForecast };

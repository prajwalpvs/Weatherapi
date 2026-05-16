const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

const isMock = !API_KEY || API_KEY === 'your_api_key_here';

function mockCurrent(label = 'Mumbai') {
  const now = Math.floor(Date.now() / 1000);
  return {
    name: label,
    sys: { country: 'IN', sunrise: now - 21600, sunset: now + 21600 },
    main: { temp: 28.4, feels_like: 31.2, humidity: 72, pressure: 1012, temp_min: 26, temp_max: 31 },
    weather: [{ main: 'Clouds', description: 'partly cloudy', icon: '02d' }],
    wind: { speed: 4.2 },
    visibility: 9000,
  };
}

function mockForecast(label = 'Mumbai') {
  const base = Date.now();
  return {
    city: { name: label, country: 'IN' },
    list: [0, 1, 2, 3, 4, 5].map((i) => ({
      dt_txt: new Date(base + i * 3 * 60 * 60 * 1000).toISOString(),
      main: { temp: 27 + i, feels_like: 30 + i, humidity: 70 + i, temp_min: 25, temp_max: 32 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 3 + i * 0.5 },
    })),
  };
}

async function getCurrentWeather({ city, lat, lon }) {
  if (isMock) return mockCurrent(city || 'My Location');
  try {
    const params = city
      ? { q: city, appid: API_KEY, units: 'metric' }
      : { lat, lon, appid: API_KEY, units: 'metric' };
    const response = await axios.get(`${BASE_URL}/weather`, { params });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) throw new Error('Invalid OpenWeatherMap API key');
    throw err;
  }
}

async function getForecast({ city, lat, lon }) {
  if (isMock) return mockForecast(city || 'My Location');
  try {
    const params = city
      ? { q: city, appid: API_KEY, units: 'metric' }
      : { lat, lon, appid: API_KEY, units: 'metric' };
    const response = await axios.get(`${BASE_URL}/forecast`, { params });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) throw new Error('Invalid OpenWeatherMap API key');
    throw err;
  }
}

module.exports = { getCurrentWeather, getForecast };

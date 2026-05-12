# Weather API

A REST API built with Node.js and Express that fetches weather data from OpenWeatherMap.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```
   PORT=3000
   NODE_ENV=development
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   Get a free API key at https://openweathermap.org/api

3. Start the development server:
   ```bash
   npm run dev
   ```

## Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Current Weather
```
GET /api/weather/current?city=London
```
Returns current weather for the given city.

### 5-Day Forecast
```
GET /api/weather/forecast?city=London
```
Returns a 5-day, 3-hour forecast for the given city.

## Project Structure

```
src/
├── server.js          # Entry point — starts the HTTP server
├── app.js             # Express app setup and middleware
├── routes/
│   └── weatherRoutes.js   # URL routing
├── controllers/
│   └── weatherController.js  # Request handlers
├── services/
│   └── weatherService.js     # OpenWeatherMap API calls
└── middleware/
    └── errorHandler.js       # Global error handling
```

## Deployment

Deployed on Render. Set the following environment variables in the Render dashboard:
- `OPENWEATHER_API_KEY`
- `NODE_ENV=production`

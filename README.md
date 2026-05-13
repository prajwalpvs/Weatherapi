# Sky Watch

A real-time weather web app built with Node.js, Express, and the OpenWeatherMap API. Search any city worldwide, use your device's location, and get live current conditions plus a 3-hour forecast.

## Features

- Current weather: temperature, feels like, humidity, wind, pressure, visibility
- 3-hour interval forecast
- Geolocation support (use your device's GPS)
- °C / °F unit toggle
- Dynamic theming based on weather condition (clear, rain, snow, thunder, etc.)
- Quick city chips for one-click search
- Responsive glassmorphism UI with animated gradient background
- Mock data fallback when no API key is configured

## Tech Stack

- **Backend:** Node.js, Express 5, axios, dotenv
- **Frontend:** Vanilla HTML/CSS/JS (no framework)
- **Data:** OpenWeatherMap API (free tier)

## Project Structure

```
weather/
├── public/
│   ├── index.html            # App shell
│   ├── style.css             # All styles
│   └── app.js                # Frontend logic
├── src/
│   ├── server.js             # Entry point (app.listen)
│   ├── app.js                # Express setup, static serving, routes
│   ├── controllers/
│   │   └── weatherController.js
│   ├── routes/
│   │   └── weatherRoutes.js
│   ├── services/
│   │   └── weatherService.js # OpenWeatherMap calls + mock fallback
│   └── middleware/
│       └── errorHandler.js
├── .env                      # API key and port (not committed)
├── .gitignore
└── package.json
```

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd weather
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the project root:

```
PORT=3000
NODE_ENV=development
OPENWEATHER_API_KEY=your_api_key_here
```

Get a free API key at [openweathermap.org](https://openweathermap.org/api). New keys take up to 2 hours to activate.

If no key is provided (or the key is not yet active), the app automatically serves mock weather data so the UI is always usable.

### 4. Run locally

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/api/weather/current` | `city` OR `lat` + `lon` | Current weather |
| GET | `/api/weather/forecast` | `city` OR `lat` + `lon` | 3-hour forecast (5 days) |
| GET | `/health` | — | Health check |

### Examples

```
GET /api/weather/current?city=London
GET /api/weather/current?lat=19.07&lon=72.87
GET /api/weather/forecast?city=Tokyo
```

## Deployment (Render)

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Add environment variables in the Render dashboard:
   - `OPENWEATHER_API_KEY` — your API key
   - `NODE_ENV` — `production`

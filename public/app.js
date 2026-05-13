let unit = 'C';

const THEMES = {
  Clear:        ['#b45309', '#f97316', '#ef4444'],
  Clouds:       ['#1f2937', '#374151', '#4b5563'],
  Rain:         ['#1e3a5f', '#1e40af', '#1d4ed8'],
  Drizzle:      ['#164e63', '#0369a1', '#0284c7'],
  Thunderstorm: ['#1a1a2e', '#3b0764', '#1e1b4b'],
  Snow:         ['#1e3a5f', '#3b82f6', '#93c5fd'],
  Mist:         ['#1f2937', '#374151', '#6b7280'],
  Fog:          ['#1f2937', '#374151', '#6b7280'],
  Haze:         ['#292524', '#44403c', '#78716c'],
};

const EMOJI = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
  Haze: '🌁', Smoke: '💨', Dust: '🌪️', Tornado: '🌪️',
};

function emoji(main) { return EMOJI[main] || '🌈'; }

function setTheme(main) {
  const [a, b, c] = THEMES[main] || ['#0f0c29', '#302b63', '#24243e'];
  const root = document.documentElement;
  root.style.setProperty('--bg1', a);
  root.style.setProperty('--bg2', b);
  root.style.setProperty('--bg3', c);
}

function toF(c) { return Math.round(c * 9 / 5 + 32); }
function fmt(c) { return unit === 'C' ? `${Math.round(c)}°C` : `${toF(c)}°F`; }
function fmtBig(c) { return unit === 'C' ? `${Math.round(c)}°` : `${toF(c)}°`; }
function fmtTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function windDir(deg) {
  if (deg === undefined) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return ' ' + dirs[Math.round(deg / 45) % 8];
}

// Clock
function updateClock() {
  document.getElementById('dateTime').textContent = new Date().toLocaleString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
updateClock();
setInterval(updateClock, 1000);

// Unit toggle
document.getElementById('unitToggle').addEventListener('click', () => {
  unit = unit === 'C' ? 'F' : 'C';
  document.getElementById('unitToggle').textContent = unit === 'C' ? '°C / °F' : '°F / °C';
  const cached = window._lastData;
  if (cached) renderCurrent(cached.current, cached.forecast);
});

// Search triggers
document.getElementById('cityInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') search();
});
document.getElementById('searchBtn').addEventListener('click', search);

// Geolocation
document.getElementById('geoBtn').addEventListener('click', () => {
  if (!navigator.geolocation) return showError('Geolocation not supported by your browser.');
  setLoading(true);
  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const [current, forecast] = await Promise.all([
          fetch(`/api/weather/current?lat=${lat}&lon=${lon}`).then(r => r.json()),
          fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}`).then(r => r.json()),
        ]);
        if (current.error) throw new Error(current.error);
        window._lastData = { current, forecast };
        renderCurrent(current, forecast);
      } catch (err) {
        showError(err.message || 'Could not get weather for your location.');
      } finally {
        setLoading(false);
      }
    },
    () => {
      setLoading(false);
      showError('Location access denied. Please allow location or search by city.');
    }
  );
});

// City chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('cityInput').value = chip.dataset.city;
    search();
  });
});

async function search() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;

  setLoading(true);
  hideError();
  hide('currentCard');
  hide('forecastCard');
  hide('welcome');

  try {
    const [current, forecast] = await Promise.all([
      fetch(`/api/weather/current?city=${encodeURIComponent(city)}`).then(r => r.json()),
      fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`).then(r => r.json()),
    ]);
    if (current.error) throw new Error(current.error);
    window._lastData = { current, forecast };
    renderCurrent(current, forecast);
  } catch (err) {
    showError(err.message || 'Could not fetch weather. Try again.');
  } finally {
    setLoading(false);
  }
}

function renderCurrent(current, forecast) {
  const main = current.weather[0].main;
  setTheme(main);

  set('cityName', current.name);
  set('country', current.sys.country);
  set('weatherIcon', emoji(main));
  set('temp', fmtBig(current.main.temp));
  set('tempHi', `↑ ${fmt(current.main.temp_max ?? current.main.temp + 2)}`);
  set('tempLo', `↓ ${fmt(current.main.temp_min ?? current.main.temp - 2)}`);
  set('desc', current.weather[0].description);
  set('feelsLike', fmt(current.main.feels_like));
  set('humidity', `${current.main.humidity}%`);
  set('wind', `${Math.round(current.wind.speed * 3.6)} km/h${windDir(current.wind.deg)}`);
  set('pressure', `${current.main.pressure} hPa`);
  set('visibility', current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : 'N/A');
  set('condition', main);
  set('sunrise', current.sys.sunrise ? fmtTime(current.sys.sunrise) : 'N/A');
  set('sunset', current.sys.sunset ? fmtTime(current.sys.sunset) : 'N/A');

  document.getElementById('forecastList').innerHTML = forecast.list.slice(0, 5).map((item, i) => {
    const t = new Date(item.dt_txt);
    return `
      <div class="forecast-item" style="animation-delay:${i * 60}ms">
        <div class="forecast-left">
          <div class="forecast-icon">${emoji(item.weather[0].main)}</div>
          <div>
            <div class="forecast-time">${t.toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</div>
            <div class="forecast-desc">${item.weather[0].description}</div>
          </div>
        </div>
        <div class="forecast-right">
          <div class="forecast-temp">${fmt(item.main.temp)}</div>
          <div class="forecast-humidity">💧 ${item.main.humidity}%</div>
        </div>
      </div>`;
  }).join('');

  show('currentCard');
  show('forecastCard');
}

function set(id, val) { document.getElementById(id).textContent = val; }
function show(id) { document.getElementById(id).style.display = 'block'; }
function hide(id) { document.getElementById(id).style.display = 'none'; }
function setLoading(on) { document.getElementById('spinner').style.display = on ? 'block' : 'none'; }
function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = `⚠️ ${msg}`;
  el.style.display = 'block';
}
function hideError() { document.getElementById('errorMsg').style.display = 'none'; }

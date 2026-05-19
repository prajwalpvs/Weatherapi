let unit = 'C';
let lastData = null;

const LOCALE           = 'en-IN';
const FORECAST_PREVIEW = 5;
const FORECAST_HOURLY  = 8;
const CONDITION_ALIAS  = { Fog: 'Mist', Haze: 'Mist', Smoke: 'Mist', Dust: 'Mist', Tornado: 'Thunderstorm' };

const THEMES = {
  Clear: {
    dawn:  ['#7c2d12', '#c2410c', '#f59e0b'],
    day:   ['#0c4a6e', '#0369a1', '#0ea5e9'],
    dusk:  ['#7c3aed', '#c2410c', '#f59e0b'],
    night: ['#0c1445', '#1e3a8a', '#312e81'],
  },
  Clouds: {
    dawn:  ['#1c1917', '#44403c', '#78716c'],
    day:   ['#1f2937', '#374151', '#4b5563'],
    dusk:  ['#292524', '#44403c', '#57534e'],
    night: ['#111827', '#1f2937', '#374151'],
  },
  Rain: {
    dawn:  ['#0f172a', '#1e3a5f', '#1e40af'],
    day:   ['#1e3a5f', '#1e40af', '#1d4ed8'],
    dusk:  ['#1e1b4b', '#1e3a5f', '#1e40af'],
    night: ['#0f172a', '#0c1445', '#1e3a8a'],
  },
  Drizzle: {
    dawn:  ['#082f49', '#0c4a6e', '#0369a1'],
    day:   ['#164e63', '#0369a1', '#0284c7'],
    dusk:  ['#082f49', '#0c4a6e', '#1e3a5f'],
    night: ['#020617', '#082f49', '#0c4a6e'],
  },
  Thunderstorm: {
    dawn:  ['#0a0a1a', '#1a0530', '#3b0764'],
    day:   ['#1a1a2e', '#3b0764', '#1e1b4b'],
    dusk:  ['#0f0a19', '#1e0836', '#1a1a2e'],
    night: ['#030712', '#0a0a1a', '#1a0530'],
  },
  Snow: {
    dawn:  ['#1e3a5f', '#3b82f6', '#bfdbfe'],
    day:   ['#1e3a5f', '#3b82f6', '#93c5fd'],
    dusk:  ['#1e3a5f', '#2563eb', '#7c3aed'],
    night: ['#0f172a', '#1e3a8a', '#1e3a5f'],
  },
  Mist: {
    dawn:  ['#1c1917', '#292524', '#57534e'],
    day:   ['#1f2937', '#374151', '#6b7280'],
    dusk:  ['#1c1917', '#292524', '#44403c'],
    night: ['#111827', '#1f2937', '#374151'],
  },
};

const ICONS = {
  Clear: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <circle cx="24" cy="24" r="9" fill="currentColor"/>
    <g class="wx-sun-rays" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <line x1="24" y1="5"  x2="24" y2="11"/>
      <line x1="24" y1="37" x2="24" y2="43"/>
      <line x1="5"  y1="24" x2="11" y2="24"/>
      <line x1="37" y1="24" x2="43" y2="24"/>
      <line x1="9.4"  y1="9.4"  x2="13.8" y2="13.8"/>
      <line x1="34.2" y1="34.2" x2="38.6" y2="38.6"/>
      <line x1="38.6" y1="9.4"  x2="34.2" y2="13.8"/>
      <line x1="13.8" y1="34.2" x2="9.4"  y2="38.6"/>
    </g>
  </svg>`,

  Clouds: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <g class="wx-cloud-body" fill="currentColor">
      <ellipse cx="24" cy="32" rx="18" ry="8"/>
      <circle cx="18" cy="26" r="9"/>
      <circle cx="28" cy="22" r="11"/>
    </g>
  </svg>`,

  Rain: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <g fill="currentColor">
      <ellipse cx="24" cy="22" rx="16" ry="7"/>
      <circle cx="18" cy="17" r="8"/>
      <circle cx="27" cy="14" r="10"/>
    </g>
    <line class="wx-drops"   x1="16" y1="32" x2="13" y2="42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line class="wx-drops-2" x1="24" y1="32" x2="21" y2="42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line class="wx-drops-3" x1="32" y1="32" x2="29" y2="42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  Drizzle: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <g fill="currentColor">
      <ellipse cx="24" cy="22" rx="16" ry="7"/>
      <circle cx="18" cy="17" r="8"/>
      <circle cx="27" cy="14" r="10"/>
    </g>
    <line class="wx-drops"   x1="15" y1="32" x2="13" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line class="wx-drops-2" x1="22" y1="32" x2="20" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line class="wx-drops-3" x1="29" y1="32" x2="27" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line class="wx-drops"   x1="36" y1="32" x2="34" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  Thunderstorm: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <g fill="currentColor">
      <ellipse cx="24" cy="22" rx="16" ry="7"/>
      <circle cx="18" cy="17" r="8"/>
      <circle cx="27" cy="14" r="10"/>
    </g>
    <polyline class="wx-bolt" points="27,29 22,38 26,38 21,47"
      fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`,

  Snow: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <g fill="currentColor">
      <ellipse cx="24" cy="22" rx="16" ry="7"/>
      <circle cx="18" cy="17" r="8"/>
      <circle cx="27" cy="14" r="10"/>
    </g>
    <circle class="wx-snow-flakes"   cx="16" cy="36" r="2.5" fill="currentColor"/>
    <circle class="wx-snow-flakes-2" cx="24" cy="38" r="2.5" fill="currentColor"/>
    <circle class="wx-snow-flakes-3" cx="32" cy="36" r="2.5" fill="currentColor"/>
  </svg>`,

  Mist: `<svg viewBox="0 0 48 48" width="1em" height="1em" class="wx-icon" aria-hidden="true">
    <line class="wx-mist-1" x1="8"  y1="16" x2="40" y2="16" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <line class="wx-mist-2" x1="12" y1="24" x2="36" y2="24" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <line class="wx-mist-3" x1="8"  y1="32" x2="40" y2="32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,
};

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 8)  return 'dawn';
  if (h >= 8  && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
}

function icon(main) {
  return ICONS[CONDITION_ALIAS[main] || main] || ICONS.Mist;
}

function setTheme(main) {
  const [a, b, c] = (THEMES[CONDITION_ALIAS[main] || main] || THEMES.Mist)[getTimeOfDay()];
  const root = document.documentElement;
  root.style.setProperty('--bg1', a);
  root.style.setProperty('--bg2', b);
  root.style.setProperty('--bg3', c);
}

function toF(c) { return Math.round(c * 9 / 5 + 32); }
function fmt(c) { return unit === 'C' ? `${Math.round(c)}°C` : `${toF(c)}°F`; }
function fmtBig(c) { return unit === 'C' ? `${Math.round(c)}°` : `${toF(c)}°`; }
function fmtTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}
function windDir(deg) {
  if (deg === undefined) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return ' ' + dirs[Math.round(deg / 45) % 8];
}

// Clock
function updateClock() {
  document.getElementById('dateTime').textContent = new Date().toLocaleString(LOCALE, {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
updateClock();
setInterval(updateClock, 1000);

// Unit toggle
document.getElementById('unitToggle').addEventListener('click', () => {
  unit = unit === 'C' ? 'F' : 'C';
  document.getElementById('unitToggle').textContent = unit === 'C' ? 'Switch to °F' : 'Switch to °C';
  if (lastData) renderCurrent(lastData.current, lastData.forecast);
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
        if (current.error)  throw new Error(current.error);
        if (forecast.error) throw new Error(forecast.error);
        lastData = { current, forecast };
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
  if (city.length > 100) return showError('City name too long.');

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
    if (current.error)  throw new Error(current.error);
    if (forecast.error) throw new Error(forecast.error);
    lastData = { current, forecast };
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
  document.getElementById('weatherIcon').innerHTML = icon(main);
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

  document.getElementById('forecastList').innerHTML = forecast.list.slice(0, FORECAST_PREVIEW).map((item, i) => {
    const t = new Date(item.dt_txt);
    const timeStr = t.toLocaleString(LOCALE, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    return `
      <div class="forecast-item" role="button" tabindex="0"
           aria-label="${esc(timeStr)}: ${esc(item.weather[0].description)}, ${esc(fmt(item.main.temp))}"
           style="animation-delay:${i * 60}ms">
        <div class="forecast-left">
          <div class="forecast-icon">${icon(item.weather[0].main)}</div>
          <div>
            <div class="forecast-time">${esc(timeStr)}</div>
            <div class="forecast-desc">${esc(item.weather[0].description)}</div>
          </div>
        </div>
        <div class="forecast-right">
          <div class="forecast-temp">${esc(fmt(item.main.temp))}</div>
          <div class="forecast-humidity">💧 ${esc(String(item.main.humidity))}%</div>
          <div class="forecast-chevron" aria-hidden="true">›</div>
        </div>
      </div>`;
  }).join('');

  document.querySelectorAll('#forecastList .forecast-item').forEach(el => {
    el.addEventListener('click', () => openHourlyModal(forecast));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHourlyModal(forecast); }
    });
  });

  show('currentCard');
  show('forecastCard');
}

function openHourlyModal(forecast) {
  document.getElementById('hourlyList').innerHTML = forecast.list.slice(0, FORECAST_HOURLY).map(item => {
    const t = new Date(item.dt_txt);
    const timeStr = t.toLocaleString(LOCALE, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `
      <div class="hourly-item">
        <div class="hourly-icon">${icon(item.weather[0].main)}</div>
        <div>
          <div class="hourly-time">${esc(timeStr)}</div>
          <div class="hourly-desc">${esc(item.weather[0].description)}</div>
          <div class="hourly-meta">💧 ${esc(String(item.main.humidity))}% &middot; 💨 ${esc(String(Math.round(item.wind.speed * 3.6)))} km/h</div>
        </div>
        <div>
          <div class="hourly-temp">${esc(fmt(item.main.temp))}</div>
          <div class="hourly-wind">Feels ${esc(fmt(item.main.feels_like))}</div>
        </div>
      </div>`;
  }).join('');

  const modal = document.getElementById('hourlyModal');
  modal.classList.add('open');

  const focusable = modal.querySelectorAll('button, [tabindex="0"]');
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }
  modal._trapFocus = trapFocus;
  modal.addEventListener('keydown', trapFocus);
  first.focus();
}

function closeModal() {
  const modal = document.getElementById('hourlyModal');
  if (modal._trapFocus) {
    modal.removeEventListener('keydown', modal._trapFocus);
    modal._trapFocus = null;
  }
  modal.classList.remove('open');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('hourlyModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

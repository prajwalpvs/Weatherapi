const weatherService = require('../services/weatherService');

async function getCurrent(req, res, next) {
  try {
    const { city, lat, lon } = req.query;
    if (!city && (!lat || !lon)) return res.status(400).json({ error: 'Provide city or lat & lon' });
    const data = await weatherService.getCurrentWeather({ city, lat, lon });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getForecast(req, res, next) {
  try {
    const { city, lat, lon } = req.query;
    if (!city && (!lat || !lon)) return res.status(400).json({ error: 'Provide city or lat & lon' });
    const data = await weatherService.getForecast({ city, lat, lon });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrent, getForecast };

const weatherService = require('../services/weatherService');

async function getCurrent(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'city query param is required' });
    const data = await weatherService.getCurrentWeather(city);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getForecast(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'city query param is required' });
    const data = await weatherService.getForecast(city);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrent, getForecast };

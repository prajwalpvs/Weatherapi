const weatherService = require('../services/weatherService');

function makeHandler(serviceFn) {
  return async (req, res, next) => {
    try {
      const { city, lat, lon } = req.query;
      if (!city && (!lat || !lon))
        return res.status(400).json({ error: 'Provide city or lat & lon' });
      res.json(await serviceFn({ city, lat, lon }));
    } catch (err) { next(err); }
  };
}

module.exports = {
  getCurrent:  makeHandler(weatherService.getCurrentWeather),
  getForecast: makeHandler(weatherService.getForecast),
};

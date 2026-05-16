require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./middleware/errorHandler');

const path = require('path');

const app = express();

const weatherLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/weather', weatherLimiter, weatherRoutes);
app.use(errorHandler);

module.exports = app;

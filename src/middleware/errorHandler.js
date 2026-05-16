function errorHandler(err, req, res, next) {
  const status = err.response?.status || 500;
  const message = status < 500
    ? (err.response?.data?.message || err.message || 'Bad request')
    : (err.message || 'Internal server error');
  res.status(status).json({ error: message });
}

module.exports = errorHandler;

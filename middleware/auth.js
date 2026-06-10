function requireApiKey(req, res, next) {
  const providedKey = req.header('x-api-key');

  if (!providedKey) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'Missing x-api-key header.',
      },
    });
  }

  const validKeys = (process.env.API_KEYS || '')
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean);

  if (!validKeys.includes(providedKey)) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key.',
      },
    });
  }

  next();
}

module.exports = requireApiKey;

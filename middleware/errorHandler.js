// Middleware global de gestion des erreurs.
// Intercepte les erreurs générées par l'application et retourne une réponse JSON standardisée.

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'Unexpected server error.',
    },
  });
}

module.exports = errorHandler;

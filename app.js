// Configuration de l'application Express.
// Enregistre les middlewares et les routes de l'API.

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const deviceRoutes = require('./routes/devices');
const measurementRoutes = require('./routes/measurements');
const observationRoutes = require('./routes/observations');
const ambianceRoutes = require('./routes/ambiance');
const errorHandler = require('./middleware/errorHandler');
const placeRoutes = require('./routes/places');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IFT3225 Phase 2 Ambiance API',
    endpoints: [
      '/devices',
      '/measurements',
      '/observations',
      '/ambiance/:location/history',
      '/ambiance/:location/quiet-hours',
      '/ambiance/:location/comfort-score',
      '/users/register',
      '/users/login',
      '/places'
    ]
  });
});

app.use('/devices', deviceRoutes);
app.use('/measurements', measurementRoutes);
app.use('/observations', observationRoutes);
app.use('/ambiance', ambianceRoutes);
app.use('/places', placeRoutes);
app.use('/users', userRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

app.use(errorHandler);

module.exports = app;

// Contrôleur d'analyse d'ambiance.
// Produit des informations dérivées à partir des mesures
// et observationsenregistrées.

const Measurement = require('../models/measurements');
const Observation = require('../models/observations');

// Note: Phyphox (capteur "Audio Amplitude") retourne un niveau sonore
// relatif au plein-échelle du micro (dBFS), donc des valeurs négatives
// (ex: -75 à -45 environ). Ce n'est PAS un dB SPL calibré (qui serait
// positif, ~30-90 dB). Les seuils ci-dessous sont calibrés sur cette
// échelle dBFS, à partir des sessions de collecte réelles. Une vraie
// calibration nécessiterait un sonomètre de référence (voir rapport,
// section "Limites et évolution").
function classifyNoise(avgSoundDb) {
  if (avgSoundDb == null) return 'unknown';
  if (avgSoundDb < -65) return 'quiet';
  if (avgSoundDb < -58) return 'normal';
  if (avgSoundDb < -48) return 'noisy';
  return 'very_noisy';
}

function classifyMovement(avgAccelerationMagnitude) {
  if (avgAccelerationMagnitude == null) return 'unknown';
  if (avgAccelerationMagnitude < 9.9) return 'stable';
  if (avgAccelerationMagnitude < 11.5) return 'moderate_movement';
  return 'high_movement';
}

function average(values) {
  const nums = values.filter((value) => typeof value === 'number' && !Number.isNaN(value));
  if (nums.length === 0) return null;
  return Number((nums.reduce((sum, value) => sum + value, 0) / nums.length).toFixed(2));
}

async function getHistory(req, res, next) {
  try {
    const { location } = req.params;
    const limit = Number(req.query.limit || 50);

    const measurements = await Measurement.find({ location: location.toLowerCase() })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('timestamp soundLevelDb lightLevelLux acceleration.magnitude gyroscope.magnitude');

    const avgSoundDb = average(measurements.map((m) => m.soundLevelDb));
    const avgLightLux = average(measurements.map((m) => m.lightLevelLux));
    const avgAcceleration = average(measurements.map((m) => m.acceleration?.magnitude));

    res.json({
      success: true,
      data: {
        location: location.toLowerCase(),
        count: measurements.length,
        summary: {
          avgSoundDb,
          avgLightLux,
          avgAccelerationMagnitude: avgAcceleration,
          noiseClassification: classifyNoise(avgSoundDb),
          movementClassification: classifyMovement(avgAcceleration),
        },
        timeline: measurements.reverse(),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getQuietHours(req, res, next) {
  try {
    const { location } = req.params;

    const rows = await Measurement.aggregate([
      { $match: { location: location.toLowerCase(), soundLevelDb: { $ne: null } } },
      {
        $group: {
          _id: { hour: { $hour: '$timestamp' } },
          avgSoundDb: { $avg: '$soundLevelDb' },
          samples: { $sum: 1 },
        },
      },
      { $sort: { avgSoundDb: 1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        location: location.toLowerCase(),
        quietHours: rows.map((row) => ({
          hour: row._id.hour,
          label: `${String(row._id.hour).padStart(2, '0')}:00-${String((row._id.hour + 1) % 24).padStart(2, '0')}:00`,
          avgSoundDb: Number(row.avgSoundDb.toFixed(2)),
          samples: row.samples,
          classification: classifyNoise(row.avgSoundDb),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getComfortScore(req, res, next) {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find({ location: location.toLowerCase() })
      .sort({ timestamp: -1 })
      .limit(100);

    const observations = await Observation.find({ location: location.toLowerCase() })
      .sort({ timestamp: -1 })
      .limit(20);

    const avgSoundDb = average(measurements.map((m) => m.soundLevelDb));
    const avgLightLux = average(measurements.map((m) => m.lightLevelLux));
    const avgMovement = average(measurements.map((m) => m.acceleration?.magnitude));

    let score = 100;
    // Échelle dBFS (Phyphox, valeurs négatives) : on pénalise au-dessus
    // de -58 dBFS (seuil "normal" de classifyNoise), proportionnellement.
    if (avgSoundDb != null) score -= Math.max(0, avgSoundDb - (-58)) * 1.2;
    if (avgLightLux != null && avgLightLux < 100) score -= 15;
    if (avgLightLux != null && avgLightLux > 900) score -= 10;
    if (avgMovement != null && avgMovement > 11) score -= 10;

    const highCrowdObservations = observations.filter((o) => o.crowdLevel === 'high').length;
    score -= highCrowdObservations * 2;
    score = Math.max(0, Math.min(100, Math.round(score)));

    res.json({
      success: true,
      data: {
        location: location.toLowerCase(),
        comfortScore: score,
        classification: score >= 80 ? 'comfortable' : score >= 60 ? 'acceptable' : 'uncomfortable',
        metrics: {
          avgSoundDb,
          avgLightLux,
          avgMovement,
          recentObservations: observations.length,
          highCrowdObservations,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getHistory, getQuietHours, getComfortScore };
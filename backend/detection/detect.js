const {
  haversineDistance,
  bearing,
  angularDifference,
} = require('../utils/geo');

function detectAlert(vehicle, activeAmbulances, config) {
  const now = Date.now();
  const candidates = [];

  for (const ambulance of activeAmbulances) {
    const lastUpdatedAt = new Date(ambulance.lastUpdatedAt).getTime();

    if (now - lastUpdatedAt > config.STALE_THRESHOLD_MS) {
      continue;
    }

    const distance = haversineDistance(
      ambulance.lat,
      ambulance.lng,
      vehicle.lat,
      vehicle.lng,
    );

    if (distance <= 0.01) {
      continue;
    }

    if (distance > config.PROXIMITY_THRESHOLD_METERS) {
      continue;
    }

    const bearingToVehicle = bearing(
      ambulance.lat,
      ambulance.lng,
      vehicle.lat,
      vehicle.lng,
    );
    const difference = angularDifference(ambulance.heading, bearingToVehicle);

    if (difference > config.BEARING_TOLERANCE_DEGREES) {
      continue;
    }

    if (ambulance.speed < config.MIN_AMBULANCE_SPEED_MPS) {
      continue;
    }

    const eta = Math.round(distance / ambulance.speed);
    let severity = 'low';

    if (eta <= config.SEVERITY_ETA_HIGH_MAX_SECONDS) {
      severity = 'high';
    } else if (eta <= config.SEVERITY_ETA_MEDIUM_MAX_SECONDS) {
      severity = 'medium';
    }

    candidates.push({
      ambulanceId: ambulance.ambulanceId,
      distance: Math.round(distance),
      eta,
      severity,
    });
  }

  if (candidates.length === 0) {
    return { alert: false };
  }

  const mostUrgent = candidates.reduce((currentBest, candidate) =>
    candidate.eta < currentBest.eta ? candidate : currentBest,
  );

  return { alert: true, ...mostUrgent };
}

module.exports = { detectAlert };

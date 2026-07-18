const express = require('express');
const { getActiveAmbulances, upsertVehicle } = require('../store/memoryStore');
const { detectAlert } = require('../detection/detect');
const config = require('../config');

const router = express.Router();

function isNumberInRange(value, minimum, maximum) {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum;
}

router.post('/vehicle/location', (req, res) => {
  const { vehicleId, lat, lng, heading } = req.body;

  if (typeof vehicleId !== 'string' || vehicleId.trim() === '') {
    return res.status(400).json({ error: 'vehicleId must be a non-empty string' });
  }

  if (!isNumberInRange(lat, -90, 90)) {
    return res.status(400).json({ error: 'lat must be a number between -90 and 90' });
  }

  if (!isNumberInRange(lng, -180, 180)) {
    return res.status(400).json({ error: 'lng must be a number between -180 and 180' });
  }

  if (typeof heading !== 'number' || !Number.isFinite(heading) || heading < 0 || heading >= 360) {
    return res.status(400).json({ error: 'heading must be a number from 0 up to 360' });
  }

  const vehicle = upsertVehicle({ vehicleId, lat, lng, heading });
  const activeAmbulances = getActiveAmbulances();
  const alert = detectAlert(vehicle, activeAmbulances, config);

  return res.status(200).json(alert);
});

module.exports = router;

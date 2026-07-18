const express = require('express');
const {
  upsertAmbulance,
  stopAmbulance,
  getAllAmbulances,
} = require('../store/memoryStore');

const router = express.Router();

function isNumberInRange(value, minimum, maximum) {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum;
}

router.post('/ambulance/location', (req, res) => {
  const { ambulanceId, lat, lng, speed, heading } = req.body;

  if (typeof ambulanceId !== 'string' || ambulanceId.trim() === '') {
    return res.status(400).json({ error: 'ambulanceId must be a non-empty string' });
  }

  if (!isNumberInRange(lat, -90, 90)) {
    return res.status(400).json({ error: 'lat must be a number between -90 and 90' });
  }

  if (!isNumberInRange(lng, -180, 180)) {
    return res.status(400).json({ error: 'lng must be a number between -180 and 180' });
  }

  if (typeof speed !== 'number' || !Number.isFinite(speed) || speed < 0) {
    return res.status(400).json({ error: 'speed must be a number greater than or equal to 0' });
  }

  if (typeof heading !== 'number' || !Number.isFinite(heading) || heading < 0 || heading >= 360) {
    return res.status(400).json({ error: 'heading must be a number from 0 up to 360' });
  }

  upsertAmbulance({ ambulanceId, lat, lng, speed, heading });
  return res.status(200).json({ status: 'ok' });
});

router.post('/ambulance/stop', (req, res) => {
  const { ambulanceId } = req.body;

  if (typeof ambulanceId !== 'string' || ambulanceId.trim() === '') {
    return res.status(400).json({ error: 'ambulanceId is required' });
  }

  const ambulance = stopAmbulance(ambulanceId);

  if (!ambulance) {
    return res.status(404).json({ error: 'ambulance not found' });
  }

  return res.status(200).json({ status: 'stopped' });
});

router.get('/ambulances', (_req, res) => {
  return res.status(200).json(getAllAmbulances());
});

module.exports = router;

const express = require('express');

const router = express.Router();

router.post('/vehicle/location', (_req, res) => {
  return res.status(501).json({ error: 'not implemented yet' });
});

module.exports = router;

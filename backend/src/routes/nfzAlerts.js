const express = require('express');
const router = express.Router();
const NFZAlert = require('../models/nfzAlertModel');

router.get('/', async (req, res) => {
  try {
    const alerts = await NFZAlert.find({}, 'icao24 zoneName intersectedAt');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

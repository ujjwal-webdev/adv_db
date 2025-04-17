const express = require('express');
const router = express.Router();
const { getLiveFlights } = require('../controllers/flightController');

router.get('/', getLiveFlights);

module.exports = router;

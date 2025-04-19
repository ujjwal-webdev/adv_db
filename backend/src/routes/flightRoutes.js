const express = require('express');
const router = express.Router();
const { getLiveFlights, getLiveFlightsFromRedis, getFlightById } = require('../controllers/flightController');

router.get('/', getLiveFlights);
router.get('/live', getLiveFlightsFromRedis); 

router.get('/:icao24', getFlightById);

module.exports = router;

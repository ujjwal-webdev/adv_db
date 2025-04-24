const express = require('express');
const { getLiveFlights, getFlightTrail } = require('../controllers/flightController');

const router = express.Router();

router.get('/', getLiveFlights);
router.get('/:icao24/trail', getFlightTrail);

module.exports = router;

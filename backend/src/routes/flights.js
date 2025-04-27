const express = require('express');
const { getLiveFlights, getFlightTrail } = require('../controllers/flightController');
const { getBusiestRoutes } = require('../controllers/routeController');

const router = express.Router();

router.get('/', getLiveFlights);
router.get('/:icao24/trail', getFlightTrail);
router.get('/busiest', getBusiestRoutes);

module.exports = router;

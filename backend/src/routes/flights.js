const express = require('express');
const { getLiveFlights, getFlightTrail } = require('../controllers/flightController');
const { getBusiestRoutes } = require('../controllers/routeController');
const { getFlightWeatherAlert } = require('../controllers/flightController');
const { getAllWeatherAlerts } = require('../controllers/flightController');

const router = express.Router();

router.get('/', getLiveFlights);
router.get('/:icao24/trail', getFlightTrail);
router.get('/busiest', getBusiestRoutes);
router.get('/:icao24/alert', getFlightWeatherAlert);
router.get('/alerts/all', getAllWeatherAlerts);


module.exports = router;

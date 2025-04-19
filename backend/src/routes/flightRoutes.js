const express = require('express');
const router = express.Router();
const { getLiveFlights, getLiveFlightsFromRedis } = require('../controllers/flightController');

router.get('/', getLiveFlights);
router.get('/live', getLiveFlightsFromRedis); 

module.exports = router;

const express = require('express');
const router = express.Router();
const { getRestrictedZones } = require('../controllers/restrictedAirspaceController');

router.get('/', getRestrictedZones);

module.exports = router;

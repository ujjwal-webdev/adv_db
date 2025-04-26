const express = require('express');
const router = express.Router();
const { getPrices } = require('../controllers/priceController');
const {getMonthlyCalendarData} = require('../controllers/priceController')
router.get('/', getPrices);
router.get('/calendar', getMonthlyCalendarData);

module.exports = router;

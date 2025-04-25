const FlightPrice = require('../models/flightPriceModel');

const getPrices = async (req, res) => {
  const { origin, destination, departure_date } = req.query;
  const query = {};

  if (origin) query.origin = origin.toUpperCase();
  if (destination) query.destination = destination.toUpperCase();
  if (departure_date) query.departure_date = departure_date;

  try {
    const prices = await FlightPrice.find(query).sort({ departure_date: 1 });
    res.json(prices);
  } catch (err) {
    console.error('Error fetching prices:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPrices,
};

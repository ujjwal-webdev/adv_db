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

const getMonthlyCalendarData = async (req, res) => {
  try {
    const { origin, destination, startDate, endDate } = req.query;

    if (!origin || !destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'origin, destination, startDate and endDate are required' });
    }

    const prices = await FlightPrice.aggregate([
      {
        $match: {
          origin,
          destination,
          departure_date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$departure_date",
          minPrice: { $min: "$price" },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formatted = prices.map(p => ({
      date: p._id,
      price: p.minPrice,
      airline: p.doc.airline,
      transfers: p.doc.transfers,
      currency: p.doc.currency
    }));

    res.json(formatted);

  } catch (err) {
    console.error('Calendar API Error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getPrices,getMonthlyCalendarData
};

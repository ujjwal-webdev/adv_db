const FlightPrice = require('../models/flightPriceModel');

async function aggregateBusiestRoutes(limit = 20) {
  const results = await FlightPrice.aggregate([
    {
      $group: {
        _id: { origin: '$origin', destination: '$destination' },
        flightCount: { $sum: 1 }
      }
    },
    { $sort: { flightCount: -1 } },
    { $limit: limit }
  ]);

  return results.map(route => ({
    origin: route._id.origin,
    destination: route._id.destination,
    count: route.flightCount,
  }));
}

module.exports = aggregateBusiestRoutes;

const FlightPrice = require('../models/flightPriceModel');

async function aggregateBusiestRoutes(limit = 20) {
  const today = new Date().toISOString().split('T')[0];

  const all = await FlightPrice.aggregate([
    {
      $match: {
        departure_date: { $gte: today }
      }
    },
    {
      $group: {
        _id: { origin: '$origin', destination: '$destination' },
        flightCount: { $sum: 1 },
        minPrice: { $min: '$price' },
        avgStops: { $avg: '$transfers' },
        avgPrice: { $avg: '$price' },
      }
    },
    { $sort: { flightCount: -1 } },
    { $limit: limit }
  ]);

  const normalized = all.map(route => {
    const { minPrice, avgStops, maxPrice, maxStops, avgPrice } = route;
    const normPrice = minPrice / (maxPrice || 1);
    const normStops = avgStops / (maxStops || 1);
    const bestScore = (normPrice * 0.6) + (normStops * 0.4);    

    return {
      origin: route._id.origin,
      destination: route._id.destination,
      count: route.flightCount,
      minPrice,
      avgStops,
      avgPrice: parseFloat(route.avgPrice.toFixed(2)),
      bestScore: parseFloat(bestScore.toFixed(3))
    };
  });

  return normalized;
}

module.exports = aggregateBusiestRoutes;

const aggregateBusiestRoutes = require('../services/aggregateFlights');

async function getBusiestRoutes(req, res) {
  try {
    const routes = await aggregateBusiestRoutes(20);
    res.json(routes);
  } catch (err) {
    console.error('Failed fetching busiest routes', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getBusiestRoutes };

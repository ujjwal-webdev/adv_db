const { getLiveFlightsFromOpenSky } = require('../services/openskyService');

const getLiveFlights = async (req, res) => {
  try {
    const data = await getLiveFlightsFromOpenSky();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
};

module.exports = { getLiveFlights };

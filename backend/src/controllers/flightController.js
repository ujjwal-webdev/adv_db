const redis = require('../services/redisClient');
const axios = require('axios');

const getLiveFlights = async (req, res) => {
  try {
    const keys = await redis.keys('flight:*');
    const flights = [];

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) flights.push(JSON.parse(data));
    }

    const limitedFlights = flights.slice(0, 200);
    res.json(limitedFlights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights from Redis' });
  }
};

const getFlightTrail = async (req, res) => {
  const { icao24 } = req.params;

  try {
    const response = await axios.get('https://opensky-network.org/api/tracks/all', {
      params: { icao24 },
      auth: {
        username: process.env.OS_USER,
        password: process.env.OS_PASS
      }
    });

    const path = response.data?.path;

    if (!Array.isArray(path)) {
      return res.status(404).json({ error: 'Flight trail not available' });
    }

    // Extract lat/lon from the path
    const trail = path.map(entry => {
      const [, lat, lon] = entry;
      return { latitude: lat, longitude: lon };
    });

    res.json(trail);
  } catch (error) {
    console.error('Error fetching flight trail:', error.message);
    res.status(500).json({ error: 'Failed to retrieve flight trail' });
  }
};

module.exports = { getLiveFlights, getFlightTrail };

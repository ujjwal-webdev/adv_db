const { getLiveFlightsFromOpenSky, updateFlightsInDatabase } = require('../services/openskyService');
const redisClient = require('../db/redis');
const { getFlightsFromRedis } = require('../services/redisFlightService');

const getLiveFlights = async (req, res) => {
  try {
    await updateFlightsInDatabase();  
    const flights = await getFlightsFromRedis(); 
    res.json(flights); 
  } catch (err) {
    console.error('Error in getLiveFlights:', err);
    res.status(500).json({ error: 'Failed to fetch flight data from Redis' });
  }
};

const getLiveFlightsFromRedis = async (req, res) => {
  try {
    const keys = await redisClient.keys('flight:*'); 

    if (keys.length === 0) {
      return res.json([]); 
    }
    const values = await redisClient.mGet(keys); 
    const flights = values.map((v) => JSON.parse(v));
    res.json(flights);
  } catch (err) {
    console.error('Error reading Redis:', err);
    res.status(500).json({ error: 'Error fetching live flight data' });
  }
};

module.exports = { getLiveFlights, getLiveFlightsFromRedis };

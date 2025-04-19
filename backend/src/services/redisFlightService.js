const redisClient = require('../db/redis');

const getFlightsFromRedis = async () => {
  try {
    const keys = await redisClient.keys('flight:*');

    if (!keys.length) {
      console.warn('No flight data found in Redis');
      return [];
    }

    const values = await redisClient.mGet(keys);
    const parsed = values.map(val => JSON.parse(val));
    return parsed;
  } catch (err) {
    console.error('Error reading Redis:', err);
    return [];
  }
};

module.exports = { getFlightsFromRedis };

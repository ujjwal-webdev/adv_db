const redis = require('../services/redisClient');
const Flight = require('../models/flightModel');

async function syncRedisToMongo() {
  try {
    const keys = await redis.keys('flight:*');

    for (const key of keys) {
      const data = await redis.get(key);
      const flight = JSON.parse(data);
      await Flight.create(flight);
    }

    console.log(`Synced ${keys.length} flights to MongoDB`);
  } catch (err) {
    console.error('MongoDB sync error:', err.message);
  }
}

module.exports = syncRedisToMongo;

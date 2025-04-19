const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log('Redis connected');
})();

module.exports = redisClient;

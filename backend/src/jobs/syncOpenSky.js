const axios = require('axios');
const redis = require('../services/redisClient');

async function fetchOpenSkyAndCache() {
  try {
    const res = await axios.get('https://opensky-network.org/api/states/all',
      {
        auth: {
          username: process.env.OS_USER,
          password: process.env.OS_PASS
        }
      }
    );
    const flights = res.data.states;

    for (const flight of flights) {
      const [icao24, callsign, origin_country, , last_contact, longitude, latitude, baro_altitude, , velocity, true_track] = flight;

      const data = {
        icao24,
        callsign: callsign?.trim(),
        origin_country,
        longitude,
        latitude,
        altitude: baro_altitude,
        velocity,
        last_contact,
        timestamp: new Date(),
        true_track
      };

      if (icao24 && latitude && longitude) {
        await redis.set(`flight:${icao24}`, JSON.stringify(data), { EX: 600 }); // 10 mins TTL

        const trailKey = `trail:${icao24}`;
        const point = JSON.stringify([latitude, longitude]);
        await redis.lPush(trailKey, point);
        await redis.lTrim(trailKey, 0, 9);
      }
    }

    console.log(`Cached ${flights.length} flights and trails to Redis`);
  } catch (err) {
    console.error('OpenSky fetch error:', err.message);
  }
}

module.exports = fetchOpenSkyAndCache;

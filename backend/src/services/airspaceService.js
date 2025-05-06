const axios = require('axios');
const turf = require('@turf/turf');
const NFZAlert = require('../models/nfzAlertModel');
const RestrictedAirspace = require('../models/restrictedAirspaceModel');
const redisClient = require('./redisClient');

const getRestrictedAirspaces = async () => {
  const res = await axios.get('/api/airspaces/restricted');
  return res.data;
};

async function checkNFZViolationsBatch(limit = 50) {
  const keys = await redisClient.keys('flight:*');
  const nfzZones = await RestrictedAirspace.find({}, 'name geometry').lean();

  for (const key of keys.slice(0, limit)) {
    const data = await redisClient.get(key);
    if (!data) continue;

    let { icao24, latitude, longitude, true_track = 0, velocity = 200 } = JSON.parse(data);

    if (velocity < 200) {
      velocity = 200;
    }

    const start = turf.point([longitude, latitude]);
    const distance = velocity * 60 * 3 / 1000; // project for 3 minutes in km
    const destination = turf.destination(start, distance, true_track);

    const flightLine = turf.lineString([start.geometry.coordinates, destination.geometry.coordinates]);

    for (const zone of nfzZones) {
      const polygon = turf.polygon(zone.geometry.coordinates);
      if (turf.booleanIntersects(flightLine, polygon)) {
        await NFZAlert.findOneAndUpdate(
          { icao24 },
          {
            icao24,
            zoneId: zone._id,
            zoneName: zone.name,
            intersectedAt: new Date(),
          },
          { upsert: true }
        );
        break;
      }
    }
  }

  console.log('NFZ check completed.');
}

module.exports = { getRestrictedAirspaces, checkNFZViolationsBatch };

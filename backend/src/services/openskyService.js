const axios = require('axios');
const FlightSnapshot = require('../models/flightModel');  
const redisClient = require('../db/redis'); 
const mongoose = require('mongoose');

const getLiveFlightsFromOpenSky = async () => {
  try {
    const res = await axios.get('https://opensky-network.org/api/states/all');
    const flights = res.data.states;
    console.log('Fetched flights from OpenSky:', flights);
    
    if (Array.isArray(flights) && flights.length > 0) {
      await saveFlightSnapshotsToDB(flights); 
      await cacheFlightsToRedis(flights); 
      console.log('Flight data fetched and saved');
    } else {
      console.warn('No flights data received or the data is invalid');
    }
    return flights;  
  } catch (err) {
    console.error('Failed to fetch flight data from OpenSky API:', err);
    throw err;
  }
};

const saveFlightSnapshotsToDB = async (flights) => {
  for (const flightData of flights) {
    const [
      icao24,
      callsign,
      country,
      , , latitude, longitude, altitude, isOnGround, speed, course, verticalSpeed,
    ] = flightData;

    const lat = isNaN(Number(latitude)) ? 0 : Number(latitude);
    const lon = isNaN(Number(longitude)) ? 0 : Number(longitude);
    const alt = isNaN(Number(altitude)) ? 0 : Number(altitude);
    const spd = isNaN(Number(speed)) ? 0 : Number(speed);
    const crs = isNaN(Number(course)) ? 0 : Number(course);
    const vertSpd = isNaN(Number(verticalSpeed)) ? 0 : Number(verticalSpeed);

    const flight = new FlightSnapshot({
      icao24: icao24 || 'UNKNOWN',
      callsign: callsign || 'UNKNOWN',
      country: country || 'Unknown',
      latitude: lat,
      longitude: lon,
      altitude: alt,
      speed: spd,
      course: crs,
      verticalSpeed: vertSpd,
      isOnGround: isOnGround != null ? isOnGround : false,
      //timestamp: Date.now(), 
    });

    try {
      await flight.save(); 
      console.log('Flight data saved to MongoDB');
    } catch (err) {
      console.error('Error saving flight data:', err);
    }
    await redisClient.set(`flight:${icao24}`, JSON.stringify({
      callsign,
      country,
      latitude: lat,
      longitude: lon,
      altitude: alt,
      speed: spd,
      course: crs,
      verticalSpeed: vertSpd,
      isOnGround
    }));    
  }
};
const updateFlightsInDatabase = async () => {
  const flightData = await getLiveFlightsFromOpenSky();
  if (Array.isArray(flightData) && flightData.length > 0) {
    console.log(`Found ${flightData.length} flights to update.`);
  } else {
    console.warn('No flights found to update.');
  }
};
console.log(module.exports);  
module.exports = { getLiveFlightsFromOpenSky, updateFlightsInDatabase };


const cacheFlightsToRedis = async (flights) => {
  console.log("Caching flights to Redis...");
  for (const flight of flights) {
    const [
      icao24,
      callsign,
      country,
      , , lat, lon, alt, isOnGround, speed, course, verticalSpeed,
    ] = flight;

    if (!icao24 || !lat || !lon) continue;

    const flightObject = {
      icao24: icao24 || 'UNKNOWN',
      callsign: callsign || 'UNKNOWN',
      country: country || 'Unknown',
      latitude: Number(lat) || 0,
      longitude: Number(lon) || 0,
      altitude: Number(alt) || 0,
      speed: Number(speed) || 0,
      course: Number(course) || 0,
      verticalSpeed: Number(verticalSpeed) || 0,
      isOnGround: isOnGround || false,
      timestamp: Date.now(),
    };
      console.log(`Setting flight data for ICAO24: ${icao24} to Redis`);
    await redisClient.set(`flight:${icao24}`, JSON.stringify(flightObject), {
      EX: 300,
    }, (err, reply) => {
      if (err) {
        console.error('Error saving flight data to Redis:', err);
      } else {
        console.log(`Flight ${icao24} saved to Redis: ${reply}`);
      }
    });
  }
};

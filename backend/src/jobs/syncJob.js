const { getLiveFlightsFromOpenSky, updateFlightsInDatabase } = require('../services/openskyService');

const syncFlightData = () => {
  setInterval(async () => {
    try {
      await getLiveFlightsFromOpenSky(); 
    } catch (err) {
      console.error('Error syncing flight data:', err);
    }
  }, 10000);  
};

module.exports = { syncFlightData };

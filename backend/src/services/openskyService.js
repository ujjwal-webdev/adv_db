const axios = require('axios');

const getLiveFlightsFromOpenSky = async () => {
  const res = await axios.get('https://opensky-network.org/api/states/all');
  return res.data;
};

module.exports = { getLiveFlightsFromOpenSky };

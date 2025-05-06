const axios = require('axios');

const travelAPI = axios.create({
  baseURL: 'https://api.travelpayouts.com/v2',
  params: {
    token: process.env.TRAVELPAYOUTS_API_TOKEN
  }
});

const fetchMonthlyPrices = async (origin, destination, month = '2025-05-01', currency = 'USD') => {
    try {
      const res = await travelAPI.get('/prices/month-matrix', {
        params: {
          origin,
          destination,
          month,
          currency,
          one_way: true
        }
      });
      
      return res.data?.data || [];
    } catch (err) {
      console.error('Travelpayouts error:', err.message);
      return [];
    }
};

module.exports = { fetchMonthlyPrices };

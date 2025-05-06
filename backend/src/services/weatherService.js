const axios = require('axios');

const severeMainConditions = [
  'Thunderstorm',
  'Tornado',
  'Squall',
  'Fog',
  'Rain',
  'Snow'
];

const descriptionIndicators = [
  'heavy',
  'storm',
  'tornado',
  'thunder',
  'squall',
  'blizzard',
  'severe'
];

async function getWeatherByCoords(lat, lon) {
  try {
    const url = `https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`;
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
      }
    });

    const data = response.data;
    const main = data.weather?.[0]?.main || '';
    const description = data.weather?.[0]?.description?.toLowerCase() || '';

    const isSevereMain = severeMainConditions.includes(main);
    const isSevereDescription = descriptionIndicators.some(ind => description.includes(ind));
    const isSevere = isSevereMain || isSevereDescription;

    return isSevere
      ? { condition: main, description }
      : null;

  } catch (err) {
    console.error(`Weather API error for [${lat}, ${lon}]:`, err.message);
    return null;
  }
}

module.exports = { getWeatherByCoords };

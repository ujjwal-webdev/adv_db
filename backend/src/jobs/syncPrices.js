const { fetchMonthlyPrices } = require('../services/travelpayoutsService');
const FlightPrice = require('../models/flightPriceModel');

const syncPrices = async (origin, destination) => {
  const results = await fetchMonthlyPrices(origin, destination);

  for (const flight of results) {
    const {
      airline,
      depart_date,
      return_date,
      value,
      currency,
      number_of_changes,
      found_at
    } = flight;    

    await FlightPrice.create({
      origin,
      destination,
      airline,
      departure_date: depart_date,
      return_date: return_date || null,
      price: value,
      currency,
      transfers: number_of_changes,
      updated_at: new Date(found_at),
    });    
  }

  console.log(`Synced prices from ${origin} to ${destination}`);
};

module.exports = syncPrices;

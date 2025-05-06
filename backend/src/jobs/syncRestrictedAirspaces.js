const axios = require('axios');
const RestrictedAirspace = require('../models/restrictedAirspaceModel');

const syncRestrictedAirspaces = async () => {
  let page = 1;
  let totalPages = 5;

  try {
    console.log('Syncing restricted airspaces...');
    do {
      const res = await axios.get(`https://api.core.openaip.net/api/airspaces`, {
        params: { type: 1, page, limit: 1000 },
        headers: {
          'x-openaip-api-key': process.env.OPENAIP_API_KEY
        }
      });

      const { items, totalPages: tp } = res.data;
      totalPages = tp;

      for (const airspace of items) {
        await RestrictedAirspace.updateOne(
          { _id: airspace._id },
          {
            $set: {
              name: airspace.name,
              country: airspace.country,
              type: airspace.type,
              icaoClass: airspace.icaoClass,
              activity: airspace.activity,
              geometry: airspace.geometry,
              upperLimit: airspace.upperLimit,
              lowerLimit: airspace.lowerLimit,
              hoursOfOperation: airspace.hoursOfOperation,
              updatedAt: airspace.updatedAt
            }
          },
          { upsert: true }
        );
      }

      console.log(`Synced page ${page} of ${totalPages}`);
      page++;
    } while (page <= totalPages);

    console.log('Completed syncing restricted airspaces.');
  } catch (err) {
    console.error('Error syncing restricted airspaces:', err.message);
  }
};

module.exports = syncRestrictedAirspaces;

const RestrictedAirspace = require('../models/restrictedAirspaceModel');

const getRestrictedZones = async (req, res) => {
  try {
    const zones = await RestrictedAirspace.find({}, 'name geometry country type');
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getRestrictedZones };

const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  icao24: String,
  callsign: String,
  origin_country: String,
  longitude: Number,
  latitude: Number,
  altitude: Number,
  velocity: Number,
  last_contact: Number,
  true_track: Number,
  timestamp: Date
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);

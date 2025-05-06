const mongoose = require('mongoose');

const nfzAlertSchema = new mongoose.Schema({
  icao24: { type: String, required: true, unique: true },
  zoneId: String,
  zoneName: String,
  intersectedAt: Date,
});

module.exports = mongoose.model('NFZAlert', nfzAlertSchema);

const mongoose = require('mongoose'); 

const flightSchema = new mongoose.Schema({
  callsign: { 
    type: String, 
    required: [true, 'Callsign is required'],
    default: 'UNKNOWN' 
  },
  country: { 
    type: String, 
    required: [true, 'Country is required'],
    default: 'Unknown' 
  },
  latitude: { 
    type: Number, 
    required: [true, 'Latitude is required'],
    default: 0 
  },
  longitude: { 
    type: Number, 
    required: [true, 'Longitude is required'],
    default: 0 
  },
  altitude: { 
    type: Number, 
    required: [true, 'Altitude is required'],
    default: 0 
  },
  speed: { 
    type: Number, 
    required: [true, 'Speed is required'],
    default: 0 
  },
  course: { 
    type: Number, 
    required: [true, 'Course is required'],
    default: 0 
  },
  verticalSpeed: { 
    type: Number, 
    required: [true, 'Vertical speed is required'],
    default: 0 
  },
  isOnGround: { 
    type: Boolean, 
    required: [true, 'isOnGround is required'],
    default: false 
  },
}, {
  timestamps: true 
});


flightSchema.pre('save', function (next) {
  if (!this.callsign) {
    this.callsign = 'UNKNOWN'; 
  }
  if (!this.latitude) {
    this.latitude = 0; 
  }
  if (!this.longitude) {
    this.longitude = 0; 
  }
  if (!this.altitude) {
    this.altitude = 0; 
  }
  if (!this.verticalSpeed) {
    this.verticalSpeed = 0; 
  }
  if (!this.speed) {
    this.speed = 0; 
  }
  if (!this.course) {
    this.course = 0; 
  }
  if (this.isOnGround === undefined) {
    this.isOnGround = false; 
  }
  next();
});

const FlightSnapshot = mongoose.model('FlightSnapshot', flightSchema);

module.exports = FlightSnapshot;

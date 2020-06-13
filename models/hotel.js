const mongoose = require('mongoose');
const HotelSchema = mongoose.Schema({
  user: { type: Object },
  name: { type: String, default: '' },
  address: { type: String, default: '' },
  touristAttraction: { type: String, default: '' },
  sqm: { type: Number, default: 0 },
  country: { type: String, default: '' },
  province: { type: String, default: '' },
  city: { type: String, default: '' },
  zip: { type: Number, default: '' },
  desHotel: { type: String, default: '' },
  suggestPlayground: { type: String, default: '' },
  rulerHotel: { type: String, default: '' },
  guideToHotel: { type: String, default: '' },
  starHotel: { type: String, default: '' },
  pointRating: { type: String, default: '' },
  imageUrl: { type: Array },
  maxDay: { type: Number, default: '' },
  status: { type: Number, default: '' },
  facilities: {
    airconditioner: { type: Number, default: 0 },
    television: { type: Number, default: 0 },
    internet: { type: Number, default: 0 },
    beddingSet: { type: Number, default: 0 },
    dryer: { type: Number, default: 0 },
    cableTelevision: { type: Number, default: 0 },
    washingMachine: { type: Number, default: 0 },
    cloth: { type: Number, default: 0 },
    flatIron: { type: Number, default: 0 },
    shampoo: { type: Number, default: 0 },
    smartKey: { type: Number, default: 0 },
    coffeeMaker: { type: Number, default: 0 },
    teaMaker: { type: Number, default: 0 },
    tea: { type: Number, default: 0 },
    coffee: { type: Number, default: 0 },
    freeBreakfast: { type: Number, default: 0 },
    kitchen: { type: Number, default: 0 }
  },
  security: {
    smokeAlarmSensor: { type: Number, default: 0 },
    fireExtinguisher: { type: Number, default: 0 },
    firstAidKit: { type: Number, default: 0 },
    coAlarm: { type: Number, default: 0 }
  },
  reservationTime: {
    anyTime: { type: Number, default: 0 },
    oneYear: { type: Number, default: 0 },
    sixMonth: { type: Number, default: 0 },
    threeMonth: { type: Number, default: 0 }
  },
  cancelRoom: {
    flexible: { type: Number, default: 0 },
    strict: { type: Number, default: 0 }
  },
}, {
  timestamps: true
});
module.exports = mongoose.model('Hotels', HotelSchema);

const mongoose = require('mongoose');
const ReservationTimeSchema = mongoose.Schema({
  hotelObj: { type: Object },
  anyTime: { type: Number, default: 0 },
  oneYear: { type: Number, default: 0 },
  sixMonth: { type: Number, default: 0 },
  threeMonth: { type: Number, default: 0 }
}, {
  timestamps: true
});
module.exports = mongoose.model('ReservationTimes', ReservationTimeSchema);

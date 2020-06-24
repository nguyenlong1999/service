const mongoose = require('mongoose');
const RoomDetailSchema = mongoose.Schema({
  hotelObj: { type: Object },
  capacity: { type: Number, default: 0 },
  bathroom: { type: Number, default: 0 },
  promotion: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  priceExtra: { type: Number, default: 0 },
  bedroom: { type: Number, default: 0 },
  bedroomDetail: { type: Array },
}, {
  timestamps: true
});
module.exports = mongoose.model('RoomDetails', RoomDetailSchema);

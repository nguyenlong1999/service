const mongoose = require('mongoose');
const RoomDetailSchema = mongoose.Schema({
  hotelObj: { type: Object },
  accommodates : { type: Number, default: 0 },
  bathRooms: { type: Number, default: 0 },
  bedRooms: { type: Number, default: 0 },
  maxDay:{ type: Number, default: 0 },
  promotion: {type: Number, default:0},
  price: { type: String, default: 0 },
  bedroomDetail: { type: Array },
}, {
  timestamps: true
});
module.exports = mongoose.model('RoomDetails', RoomDetailSchema);

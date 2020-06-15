const mongoose = require('mongoose');
const CancelRoomSchema = mongoose.Schema({
  hotelObj: { type: Object },
  flexible: { type: Number, default: 0 },
  strict: { type: Number, default: 0 }
}, {
  timestamps: true
});
module.exports = mongoose.model('CancelRooms', CancelRoomSchema);

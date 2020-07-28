const mongoose = require('mongoose');
const BookingSchema = mongoose.Schema({
    hotelNameSpace: { type: String },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: {type: String, default: ''},
    roomDetailID: {type: String, default: ''},
    status: {type: String, default: 0},
    totalAmountRoom: {type: Number, default: 1},
    totalMoney: {type: Number, default: 0},
    date: {type: Object},
    hotelObjId: {type: String},
    hotelUser: {type: String},
    userUpdateId: {type: String, default: ''},
    rating: {type:Number, default: 0}
}, {
    timestamps: true
});
module.exports = mongoose.model('Booking', BookingSchema);

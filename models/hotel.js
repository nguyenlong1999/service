const mongoose = require('mongoose');
const HotelSchema = mongoose.Schema({
    user: { type: Object },
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    cancellationPolicy: { type: Number, default: 1 },
    country: { type: String, default: '' },
    guideToHotel: { type: String, default: '' },
    reservationTime: { type: Number, default: 0 },
    image: { type: String },
    rulerHotel: { type: String, default: '' },
    sqm: { type: Number, default: 0 },
    starHotel: { type: Number, default: '' },
    suggestPlayground: { type: String, default: '' },
    totalRoomNumber: { type: Number, default: 0 },
    pointRating: { type: Number, default: 0 },
    desHotel: { type: String, default: '' },
    zip: { type: String, default: '' },
    status: { type: Number, default: 0 },
    isBlock: { type: Number, default: 1 },
    nameSpace: { type: String, default: '' },
    latitude: { type: String, default: '' },
    longitude: { type: String, default: '' },
    // touristAttraction: {type: String, default: ''},
    province: {type: String, default: ''},
    // city: {type: String, default: ''},
    // maxDay: {type: Number, default: ''},
}, {
    timestamps: true
});
module.exports = mongoose.model('Hotels', HotelSchema);

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
  imageUrl: { type: String },
  maxDay: { type: Number, default: '' },
  status: { type: Number, default: '' }
}, {
  timestamps: true
});
module.exports = mongoose.model('Hotels', HotelSchema);

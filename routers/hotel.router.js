module.exports = app => {
  const hotel = require("../controllers/hotel/hotel");
  // var VerifyToken = require(__root + 'auth/VerifyToken');
  // var VerifyUserByToken = require(__root + 'auth/VerifyUserByToken');

  app.post("/createHotel", hotel.createHotel);
};

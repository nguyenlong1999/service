module.exports = app => {
    const hotel = require("../controllers/hotel/hotel");
    // var VerifyToken = require(__root + 'auth/VerifyToken');
    // var VerifyUserByToken = require(__root + 'auth/VerifyUserByToken');

    app.post("/createHotel", hotel.createHotel);
    app.get('/getHotels', hotel.getHotel);
    app.get('/getHotel/:id', hotel.getHotelById);
    app.post("/updateHotel", hotel.updateHotel);

};

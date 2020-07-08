module.exports = app => {
    const hotel = require("../controllers/hotel/hotel");
    // var VerifyToken = require(__root + 'auth/VerifyToken');
    var VerifyRoleByToken = require(__root + 'auth/VerifyRoleByToken');
    var VerifyUserByToken = require(__root + 'auth/VerifyUserByToken');
    app.post("/createHotel", VerifyUserByToken, hotel.createHotel);
    app.get('/getHotels', VerifyRoleByToken, hotel.getHotel);
    app.get('/getHotelSearch', VerifyRoleByToken, hotel.getHotelSearch);
    app.get('/getHotelsByUser/:id', VerifyUserByToken, hotel.getHotelByUser);
    app.get('/getHotel/:id', VerifyUserByToken, hotel.getHotelById);
    app.post("/updateStatusHotel", VerifyRoleByToken, hotel.updateStatusHotel);
    app.post("/updateHotel", VerifyUserByToken, hotel.updateHotel);

};

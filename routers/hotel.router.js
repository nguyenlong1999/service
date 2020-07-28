module.exports = app => {
    const hotel = require("../controllers/hotel/hotel");
    // var VerifyToken = require(__root + 'auth/VerifyToken');
    var VerifyRoleByToken = require(__root + 'auth/VerifyRoleByToken');
    var VerifyUserByToken = require(__root + 'auth/VerifyUserByToken');
    app.post("/createHotel", VerifyUserByToken, hotel.createHotel);
    app.get('/getHotels', VerifyRoleByToken, hotel.getHotel);
    app.get('/getHotelSearch', hotel.getHotelSearch);
    app.post('/getHotelFind', hotel.getHotelFind);
    app.get('/getHotelFindAll', hotel.getHotelFindAll);
    app.get('/getHotelsByUser/:id', VerifyUserByToken, hotel.getHotelByUser);
    app.get('/getHotel/:id', hotel.getHotelById);
    app.post("/updateStatusHotel", VerifyRoleByToken, hotel.updateStatusHotel);
    app.post("/updateHotel", VerifyUserByToken, hotel.updateHotel);

    app.post("/createBooking", hotel.createBooking);
    app.get("/getBookingByHotel/:email",/* VerifyUserByToken,*/ hotel.getBookingByUser)
    app.post("/updateStatusBook",/*VerifyUserByToken,*/ hotel.updateStatusBooking)
    app.get("/getBookingByUserRegister/:id", hotel.getBookingByUserRegister)
    app.post("/updateRatingBook", VerifyRoleByToken, hotel.updateRatingInBooking);

};

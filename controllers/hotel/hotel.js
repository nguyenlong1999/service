const mongoose = require("mongoose");
require("passport");
var md5 = require('md5');
const auth = require("../../routers/auth");
const Users = mongoose.model("Users");
const Hotels = mongoose.model("Hotels")
const RoomDetails = mongoose.model("RoomDetails");
const Facilities = mongoose.model("Facilities");
const ReservationTimes = mongoose.model("ReservationTimes");
const CancelRooms = mongoose.model("CancelRooms");
// const Hotels = require("../models/hotel");
const Tokens = require("../../models/Token");
const nodeMailer = require('nodemailer');
const Summarys = mongoose.model('Summarys');
//POST new user route (optional, everyone has access)

exports.createHotel = (req, res) => {
    const hotel = new Hotels({
        name: req.body.hotel.name,
        address: req.body.hotel.address,
        guideToHotel: req.body.hotel.guideToHotel,
        imageUrl: req.body.hotel.imageUrl,
        cancellationPolicy: req.body.hotel.cancellationPolicy,
        country: req.body.hotel.country,
        reservationTime: req.body.hotel.reservationTime,
        image: req.body.hotel.image,
        rulerHotel: req.body.hotel.rulerHotel,
        sqm: req.body.hotel.sqm,
        starHotel: req.body.hotel.starHotel,
        suggestPlayground: req.body.hotel.suggestPlayground,
        totalRoomNumber: req.body.hotel.totalRoomNumber,
        desHotel: req.body.hotel.desHotel,
        zip: req.body.hotel.zip,

        // touristAttraction: req.body.hotel.touristAttraction,
        // province: req.body.hotel.province,
        // city: req.body.hotel.city,
        // maxDay: req.body.hotel.maxDay,
        status: req.body.hotel.status
    });

    const faciliti = new Facilities({
        COAlarmSensor: req.body.facilities.COAlarmSensor,
        Dryer: req.body.facilities.Dryer,
        Fireplace: req.body.facilities.Fireplace,
        FirstAidKit: req.body.facilities.FirstAidKit,
        Hairdryer: req.body.facilities.Hairdryer,
        Kitchen: req.body.facilities.Kitchen,
        Shampoo: req.body.facilities.Shampoo,
        SmokeDetector: req.body.facilities.SmokeDetector,
        Smoking: req.body.facilities.Smoking,
        TowelsOfAllKinds: req.body.facilities.TowelsOfAllKinds,
        airConditional: req.body.facilities.airConditional,
        beddingSet: req.body.facilities.beddingSet,
        cableTelevision: req.body.facilities.cableTelevision,
        coffee: req.body.facilities.coffee,
        doorStaff: req.body.facilities.doorStaff,
        elevatorInHotel: req.body.facilities.elevatorInHotel,
        fireExtinguisher: req.body.facilities.fireExtinguisher,
        freeBreakfast: req.body.facilities.freeBreakfast,
        freeInternet: req.body.facilities.freeInternet,
        freeParking: req.body.facilities.freeParking,
        freeWifi: req.body.facilities.freeWifi,
        gymRoom: req.body.facilities.gymRoom,
        heaters: req.body.facilities.heaters,
        hotTub: req.body.facilities.hotTub,
        indooPool: req.body.facilities.indooPool,
        internetCharge: req.body.facilities.internetCharge,
        ironingMachine: req.body.facilities.ironingMachine,
        outdoorSwimmingPool: req.body.facilities.outdoorSwimmingPool,
        petsAllowed: req.body.facilities.petsAllowed,
        privatePool: req.body.facilities.privatePool,
        smartKey: req.body.facilities.smartKey,
        tea: req.body.facilities.tea,
        teaMaker: req.body.facilities.teaMaker,
        television: req.body.facilities.television,
        washingMachine: req.body.facilities.washingMachine,
        wheelchairAccessible: req.body.facilities.wheelchairAccessible,
        wifiCharge: req.body.facilities.wifiCharge,
        wirelessBell: req.body.facilities.wirelessBell,
        workspace: req.body.facilities.workspace,
    });

    Users.findOne({email: req.body.hotel.userEmail}, function (err, userSchema) {
        if (err) {
            return res.send({
                status: 401,
                message: 'Tài khoản đăng nhập không tồn tại'
            });
        } else if (!userSchema) {
            return res.send({
                status: 401,
                message: 'Tài khoản đăng nhập không tồn tại'
            });
        } else {
            hotel.user = userSchema;
            hotel.save().then(() => {
                faciliti.hotelObj = hotel;
                //đang code
                faciliti.save().then(() => {
                    reservationTime.hotelObj = hotel;
                    reservationTime.save().then(() => {
                        cancelRoom.hotelObj = hotel;
                        cancelRoom.save().then(() => {
                            req.body.roomDetail.forEach(item => {
                                console.log(item);
                                let roomDetail = new RoomDetails({
                                    capacity: item.capacity,
                                    bathroom: item.bathroom,
                                    promotion: item.promotion,
                                    price: item.price,
                                    priceExtra: item.priceExtra,
                                    bedroom: item.bedroom,
                                    bedroomDetail: item.bedroomDetail
                                });
                                roomDetail.hotelObj = hotel;
                                roomDetail.save().catch(err => {
                                    res.status(500).send({
                                        message: err.message || 'Some error occurred while creating the roomdetail'
                                    })
                                });
                            });
                            res.status(200).send({
                                hotel: hotel,
                                faciliti: faciliti,
                                reservationTime: reservationTime,
                                cancelRoom: cancelRoom,
                                message: 'Create hotel successfuly'
                            })
                        }).catch(err => {
                            res.status(500).send({
                                message: err.message || 'Some error occurred while creating the cancelRoom'
                            })
                        });
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || 'Some error occurred while creating the reservationTime'
                        })
                    });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || 'Some error occurred while creating the facilities'
                    })
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the hotel'
                })
            });
        }
    });
};

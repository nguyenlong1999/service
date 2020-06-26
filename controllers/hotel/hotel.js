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
    console.log(req.body)
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
        COAlarmSensor: req.body.hotel.facilities.COAlarmSensor,
        Dryer: req.body.hotel.facilities.Dryer,
        Fireplace: req.body.hotel.facilities.Fireplace,
        FirstAidKit: req.body.hotel.facilities.FirstAidKit,
        Hairdryer: req.body.hotel.facilities.Hairdryer,
        Kitchen: req.body.hotel.facilities.Kitchen,
        Shampoo: req.body.hotel.facilities.Shampoo,
        SmokeDetector: req.body.hotel.facilities.SmokeDetector,
        Smoking: req.body.hotel.facilities.Smoking,
        TowelsOfAllKinds: req.body.hotel.facilities.TowelsOfAllKinds,
        airConditional: req.body.hotel.facilities.airConditional,
        beddingSet: req.body.hotel.facilities.beddingSet,
        cableTelevision: req.body.hotel.facilities.cableTelevision,
        coffee: req.body.hotel.facilities.coffee,
        doorStaff: req.body.hotel.facilities.doorStaff,
        elevatorInHotel: req.body.hotel.facilities.elevatorInHotel,
        fireExtinguisher: req.body.hotel.facilities.fireExtinguisher,
        freeBreakfast: req.body.hotel.facilities.freeBreakfast,
        freeInternet: req.body.hotel.facilities.freeInternet,
        freeParking: req.body.hotel.facilities.freeParking,
        freeWifi: req.body.hotel.facilities.freeWifi,
        gymRoom: req.body.hotel.facilities.gymRoom,
        heaters: req.body.hotel.facilities.heaters,
        hotTub: req.body.hotel.facilities.hotTub,
        indooPool: req.body.hotel.facilities.indooPool,
        internetCharge: req.body.hotel.facilities.internetCharge,
        ironingMachine: req.body.hotel.facilities.ironingMachine,
        outdoorSwimmingPool: req.body.hotel.facilities.outdoorSwimmingPool,
        petsAllowed: req.body.hotel.facilities.petsAllowed,
        privatePool: req.body.hotel.facilities.privatePool,
        smartKey: req.body.hotel.facilities.smartKey,
        tea: req.body.hotel.facilities.tea,
        teaMaker: req.body.hotel.facilities.teaMaker,
        television: req.body.hotel.facilities.television,
        washingMachine: req.body.hotel.facilities.washingMachine,
        wheelchairAccessible: req.body.hotel.facilities.wheelchairAccessible,
        wifiCharge: req.body.hotel.facilities.wifiCharge,
        wirelessBell: req.body.hotel.facilities.wirelessBell,
        workspace: req.body.hotel.facilities.workspace,
    });
    let roomDetailsRes = []

    Users.findOne({email: req.body.hotel.email}, function (err, userSchema) {
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
                faciliti.save()
                req.body.hotel.formArrayRoomNumber.forEach(item => {
                    let bedRoomDetails = [];
                    item.bedRoomsDetails.forEach(item => {
                        bedRoomDetails.push(item)
                    })
                    let roomDetails = new RoomDetails({
                        accommodates: item.accommodates,
                        bathRooms: item.bathRooms,
                        bedRooms: item.bedRooms,
                        maxDay: item.maxDay,
                        price: item.price,
                        bedroomDetail: bedRoomDetails
                    });

                    roomDetails.hotelObj = hotel;
                    roomDetails.save().catch(err => {
                        res.status(500).send({
                            message: err.message || 'Some error occurred while creating the roomdetail'
                        })
                    });
                    roomDetailsRes.push(roomDetails)
                });
                res.status(200).send({
                    hotel: hotel,
                    faciliti: faciliti,
                    roomDetails: roomDetailsRes,
                    message: 'Create hotel successfuly'
                })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the hotel'
                })
            });
        }
    });
};

exports.getHotel = (
    async (req, res) => {
        await Hotels.find().then(
            hotel => {
                res.status(200).send(hotel)
            }
        ).catch(err => {
            console.log('not found hotel');
            res.send({
                'status': 404,
                'message': err.message || 'Some error occurred while finding hotel'
            })
        })
    });

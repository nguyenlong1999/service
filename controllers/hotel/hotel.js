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
    let roomDetailsRes = [];

    Users.findOne({ email: req.body.hotel.email }, function (err, userSchema) {
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

exports.updateHotel = (req, res) => {
    let id = mongoose.Types.ObjectId(req.body.hotel.id);
    let roomDetailsRes = [];
    Hotels.findOne({ _id: id }, function (err, hotel) {
        if (err) {
            return res.send({
                status: 401,
                message: err
            });
        }
        const userId = req.email;
        // if (userId !== hotel.user.email) {
        //     return res.send({
        //         'status': 401,
        //         'message': 'Thí chú không có quyền. Vui lòng liên hệ admin nhé!'
        //     })
        // }
        hotel.name = req.body.hotel.name;
        hotel.address = req.body.hotel.address;
        hotel.guideToHotel = req.body.hotel.guideToHotel;
        hotel.imageUrl = req.body.hotel.imageUrl;
        hotel.cancellationPolicy = req.body.hotel.cancellationPolicy;
        hotel.country = req.body.hotel.country;
        hotel.reservationTime = req.body.hotel.reservationTime;
        hotel.image = req.body.hotel.image;
        hotel.rulerHotel = req.body.hotel.rulerHotel;
        hotel.sqm = req.body.hotel.sqm;
        hotel.starHotel = req.body.hotel.starHotel;
        hotel.suggestPlayground = req.body.hotel.suggestPlayground;
        hotel.totalRoomNumber = req.body.hotel.totalRoomNumber;
        hotel.desHotel = req.body.hotel.desHotel;
        hotel.zip = req.body.hotel.zip;
        hotel.status = req.body.hotel.status
        hotel.save().then(hotelUpdate => {
            Facilities.findOne({ "hotelObj._id": id }, function (err, facilitie) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: err
                    });
                }
                facilitie.hotelObj = hotelUpdate;
                facilitie.COAlarmSensor = req.body.hotel.facilities.COAlarmSensor;
                facilitie.Dryer = req.body.hotel.facilities.Dryer;
                facilitie.Fireplace = req.body.hotel.facilities.Fireplace;
                facilitie.FirstAidKit = req.body.hotel.facilities.FirstAidKit;
                facilitie.Hairdryer = req.body.hotel.facilities.Hairdryer;
                facilitie.Kitchen = req.body.hotel.facilities.Kitchen;
                facilitie.Shampoo = req.body.hotel.facilities.Shampoo;
                facilitie.SmokeDetector = req.body.hotel.facilities.SmokeDetector;
                facilitie.Smoking = req.body.hotel.facilities.Smoking;
                facilitie.TowelsOfAllKinds = req.body.hotel.facilities.TowelsOfAllKinds;
                facilitie.airConditional = req.body.hotel.facilities.airConditional;
                facilitie.beddingSet = req.body.hotel.facilities.beddingSet;
                facilitie.cableTelevision = req.body.hotel.facilities.cableTelevision;
                facilitie.coffee = req.body.hotel.facilities.coffee;
                facilitie.doorStaff = req.body.hotel.facilities.doorStaff;
                facilitie.elevatorInHotel = req.body.hotel.facilities.elevatorInHotel;
                facilitie.fireExtinguisher = req.body.hotel.facilities.fireExtinguisher;
                facilitie.freeBreakfast = req.body.hotel.facilities.freeBreakfast;
                facilitie.freeInternet = req.body.hotel.facilities.freeInternet;
                facilitie.freeParking = req.body.hotel.facilities.freeParking;
                facilitie.freeWifi = req.body.hotel.facilities.freeWifi;
                facilitie.gymRoom = req.body.hotel.facilities.gymRoom;
                facilitie.heaters = req.body.hotel.facilities.heaters;
                facilitie.hotTub = req.body.hotel.facilities.hotTub;
                facilitie.indooPool = req.body.hotel.facilities.indooPool;
                facilitie.internetCharge = req.body.hotel.facilities.internetCharge;
                facilitie.ironingMachine = req.body.hotel.facilities.ironingMachine;
                facilitie.outdoorSwimmingPool = req.body.hotel.facilities.outdoorSwimmingPool;
                facilitie.petsAllowed = req.body.hotel.facilities.petsAllowed;
                facilitie.privatePool = req.body.hotel.facilities.privatePool;
                facilitie.smartKey = req.body.hotel.facilities.smartKey;
                facilitie.tea = req.body.hotel.facilities.tea;
                facilitie.teaMaker = req.body.hotel.facilities.teaMaker;
                facilitie.television = req.body.hotel.facilities.television;
                facilitie.washingMachine = req.body.hotel.facilities.washingMachine;
                facilitie.wheelchairAccessible = req.body.hotel.facilities.wheelchairAccessible;
                facilitie.wifiCharge = req.body.hotel.facilities.wifiCharge;
                facilitie.wirelessBell = req.body.hotel.facilities.wirelessBell;
                facilitie.workspace = req.body.hotel.facilities.workspace;
                facilitie.save().then(facilitiUpdate => {
                    RoomDetails.deleteMany({ "hotelObj._id": id }, function (err, success) {
                        if (err) {
                            return res.send({
                                status: 401,
                                message: err
                            });
                        }
                        if (success) {
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
                                roomDetailsRes.push(roomDetails);
                            });
                            res.status(200).send({
                                hotel: hotelUpdate,
                                faciliti: facilitiUpdate,
                                roomDetails: roomDetailsRes,
                                message: 'Update hotel successfuly'
                            })
                        }
                    });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || 'Some error occurred while updating the faciliti'
                    })
                });
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while update the hotel'
            })
        });
    });
};

exports.getHotel = (async (req, res) => {
    await Hotels.find().then(hotel => {
        res.status(200).send(hotel)
    }).catch(err => {
        console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getHotelById = async (req, res) => {
    const hotelObjId = mongoose.Types.ObjectId(req.params.id);
    let objectRes = []

    let tienNghi = new Facilities;
    let listRoomDetails = []
    try {
        await Facilities.find({
            "hotelObj._id": hotelObjId
        }).then(
            facilities => {
                // res.status(200).send(facilities)
                tienNghi = facilities
            }
        ).then(
            await RoomDetails.find({
                "hotelObj._id": hotelObjId
            }).then(
                roomDetails => {
                    listRoomDetails.push(roomDetails)
                }
            )
        )
        objectRes.push(tienNghi);
        objectRes.push(listRoomDetails)
        res.status(200).send(objectRes)
    } catch (error) {
        res.send({
            'status': 404,
            'message': error.message || 'Some error occurred while finding facilities'
        })
    }
};

exports.updateStatusHotel = async (req, res) => {
    var idUser = mongoose.Types.ObjectId(req.body.hotel.idUser);
    var idHotel = mongoose.Types.ObjectId(req.body.hotel.idHotel);
    var actionName = req.body.hotel.actionName;
    console.log(req.body.hotel);
    await Hotels.findOne({ _id: idHotel }, function (err, hotel) {
        if (err || hotel === null) {
            console.log(hotel);
            return res.send({
                status: 401,
                message: 'Không thể tìm thấy khách sạn!'
            });
        } else {
            Users.findOne({ _id: idUser }, function (err, user) {
                if (err || user === null) {
                    return res.send({
                        status: 401,
                        message: 'Không thể tìm thấy tài khoản của bạn!'
                    });
                } else if (user.role <= 1) {
                    return res.send({
                        status: 401,
                        message: "Bạn không phải quản trị, không có quyền duyệt khách sạn!"
                    });
                } else {
                    if (actionName === 'Duyệt') {
                        hotel.status = 1;
                    } else if (actionName === 'Bỏ duyệt') {
                        hotel.status = 0;
                    } else if (actionName === 'Khóa') {
                        hotel.isBlock = 0;
                        hotel.status = -2;
                    } else if (actionName === 'Mở khóa') {
                        hotel.isBlock = 1;
                        hotel.status = 1;
                    }
                    hotel.save((function (err) {
                        if (err) {
                            return res.send({
                                status: 401,
                                message: actionName + ' khách sạn không thành công!'
                            });
                        }
                        else {
                            // let transporter = nodeMailer.createTransport({
                            //     host: 'smtp.gmail.com',
                            //     port: 465,
                            //     secure: true,
                            //     auth: {
                            //         user: 'amthuc.anchay.2020@gmail.com',
                            //         pass: 'Colenvuoi1@'
                            //     }
                            // });
                            // let mailOptions = {
                            //     from: 'Ban quản trị website BookingHotel <amthuc.anchay.2020@gmail.com>', // sender address
                            //     to: user.email, // list of receivers
                            //     subject: 'Chào mừng đến trang web BookingHotel', // Subject line
                            //     text: req.body.body, // plain text body
                            //     html: 'Xin chúc mừng! Tài khoản của bạn đã được mở. Vui lòng đăng nhập trang chủ website BookingHotel' +
                            //         ': https://amthuc-anchay-poly.herokuapp.com/'
                            //     // html body
                            // };

                            // transporter.sendMail(mailOptions, (error, info) => {
                            //     if (error) {
                            //         return console.log(error);
                            //     }
                            //     console.log('Message %s sent: %s', info.messageId, info.response);
                            // });
                            return res.send({
                                status: 200,
                                hotel: hotel,
                                actionName: actionName,
                                message: actionName + ' khách sạn thành công'
                            });
                        }
                    }));
                }
            });
        }
    });
};

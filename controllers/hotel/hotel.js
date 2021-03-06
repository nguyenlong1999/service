const mongoose = require("mongoose");
require("passport");
var md5 = require('md5');
const auth = require("../../routers/auth");
const Users = mongoose.model("Users");
const Hotels = mongoose.model("Hotels")
const RoomDetails = mongoose.model("RoomDetails");
const Facilities = mongoose.model("Facilities");
const Messages = mongoose.model("Messages");
const Tokens = require("../../models/Token");
const nodeMailer = require('nodemailer');
const Summarys = mongoose.model('Summarys');
// booking
const Booking = mongoose.model('Booking');
//POST new user route (optional, everyone has access)

exports.createBooking = (req, res) => {
    const booking = new Booking({
        hotelNameSpace: req.body.book.hotelNameSpace,
        name: req.body.book.name,
        email: req.body.book.email,
        phone: req.body.book.phone,
        roomDetailID: req.body.book.roomDetailID,
        status: req.body.book.status,
        totalAmountRoom: req.body.book.totalAmountRoom,
        totalMoney: req.body.book.totalMoney,
        date: req.body.book.date,
        hotelObjId: req.body.book.hotelObjId,
        hotelUser: req.body.book.hotelUser,
        userUpdateId: req.body.book.userUpdateId
    })
    booking.save()
        .then(data => {
            let messageToHotel = new Messages({
                user: data.hotelUser,
                content: 'Bạn có 1 yêu cầu đặt phòng mới!!',
                imageUrl: '',
                videoUrl: '',
                news: 1
            });
            if (data.userUpdateId != '' && data.userUpdateId != null) {
                const id = mongoose.Types.ObjectId(data.userUpdateId);
                Users.findOne({_id: id}, function (err, user) {
                    if (err || user === null) {
                        console.log(err);
                    } else {
                        let messageToUserUpdate = new Messages({
                            user: user.email,
                            content: 'Yêu cầu đặt phòng của bạn đã được gửi đi. Chờ khách sạn kiểm tra phòng!!',
                            imageUrl: '',
                            videoUrl: '',
                            news: 1
                        });
                        messageToUserUpdate.save();
                    }
                })
            }

            messageToHotel.save().then(messageToHotel => {
                messageToHotel.save()
                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'booking.hotel.com.2020@gmail.com',
                        pass: 'Longquang123'
                    }
                });
                let mailOptions = {
                    from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                    to: date.hotelUser, // list of receivers
                    subject: 'Chào mừng đến trang web Booking', // Subject line
                    text: req.body.body, // plain text body
                    html: 'Thông báo!!!! Bạn có một yêu cầu đặt phòng mới'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
            }).catch(err => {
                // console.log('false to save message');
                return res.send({
                    status: 404,
                    message: err.message || 'Some error occurred while save message'
                });
            });

            res.status(200).send({
                book: data,
                status: 200,
                message: 'Yêu cầu đặt phòng của bạn đã được gửi đi. Chờ khách sạn kiểm tra phòng'
            })
        }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the booking'
        })
    })
}

exports.createHotel = (req, res) => {
    let cancellationPolicy = !req.body.hotel.cancellationPolicy ? 1 : req.body.hotel.cancellationPolicy;
    let reservationTime = !req.body.hotel.reservationTime ? 1 : req.body.hotel.reservationTime;
    const hotel = new Hotels({
        name: req.body.hotel.name,
        address: req.body.hotel.address,
        guideToHotel: req.body.hotel.guideToHotel,
        imageUrl: req.body.hotel.imageUrl,
        cancellationPolicy: cancellationPolicy,
        country: req.body.hotel.country,
        province: req.body.hotel.province,
        reservationTime: reservationTime,
        image: req.body.hotel.image,
        rulerHotel: req.body.hotel.rulerHotel,
        sqm: req.body.hotel.sqm,
        starHotel: req.body.hotel.starHotel,
        suggestPlayground: req.body.hotel.suggestPlayground,
        totalRoomNumber: req.body.hotel.totalRoomNumber,
        desHotel: req.body.hotel.desHotel,
        zip: req.body.hotel.zip,
        latitude: req.body.hotel.latitude,
        longitude: req.body.hotel.longitude,
        nameSpace: req.body.hotel.nameSpace,
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
                        lstImg: item.lstImg,
                        bedroomDetail: bedRoomDetails,
                        roomAirConditional: item.roomAirConditional,
                        roomHairdryer: item.roomHairdryer,
                        roomIroningMachine: item.roomIroningMachine,
                        roomTelevison: item.roomTelevison,
                        roomCableTV: item.roomCableTV,
                        roomFreeWifi: item.roomFreeWifi,
                        roomTea: item.roomTea,
                        roomCoffee: item.roomCoffee,
                        roomShampoo: item.roomShampoo,
                        roomBeddingSet: item.roomBeddingSet,
                        roomTowelsOfAllKinds: item.roomTowelsOfAllKinds,
                        roomWardrobe: item.roomWardrobe,
                        roomPrivatePool: item.roomPrivatePool,
                        roomHeaters: item.roomHeaters,
                        roomDryer: item.roomDryer,
                        roomTeaMaker: item.roomTeaMaker,
                        roomSmartKey: item.roomSmartKey,
                        roomFreeBreakfast: item.roomFreeBreakfast,
                        roomWorkspace: item.roomWorkspace,
                        roomFireplace: item.roomFireplace,
                        roomHotTub: item.roomHotTub,
                        roomType: item.roomType
                    });

                    roomDetails.hotelObj = hotel;
                    roomDetails.save().catch(err => {
                        res.status(500).send({
                            message: err.message || 'Some error occurred while creating the roomdetail'
                        })
                    });
                    roomDetailsRes.push(roomDetails)
                });
                faciliti.hotelObj = hotel;
                faciliti.save().then(facilitiSchema => {
                    Summarys.find()
                        .then(summary => {
                            let sum = summary[0];
                            sum.hotelCount++;
                            sum.save()
                                .then(() => {
                                    res.status(200).send({
                                        hotel: hotel,
                                        faciliti: faciliti,
                                        roomDetails: roomDetailsRes,
                                        summary: summary,
                                        status: 200,
                                        message: 'Create hotel successfuly'
                                    })
                                }).catch(err => {
                                res.send({
                                    status: 200,
                                    message: 'Lỗi khi tổng kết số khách sạn của trang web'
                                });
                            });
                        }).catch(err => {
                        res.send({
                            'status': 404,
                            message: 'Lỗi khi tổng kết số khách sạn của trang web'
                        });
                    });
                });
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
    Hotels.findOne({_id: id}, function (err, hotel) {
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
        hotel.province = req.body.hotel.province;
        hotel.reservationTime = req.body.hotel.reservationTime;
        hotel.image = req.body.hotel.image;
        hotel.rulerHotel = req.body.hotel.rulerHotel;
        hotel.sqm = req.body.hotel.sqm;
        hotel.starHotel = req.body.hotel.starHotel;
        hotel.suggestPlayground = req.body.hotel.suggestPlayground;
        hotel.totalRoomNumber = req.body.hotel.totalRoomNumber;
        hotel.desHotel = req.body.hotel.desHotel;
        hotel.zip = req.body.hotel.zip;
        hotel.status = req.body.hotel.status;
        hotel.latitude = req.body.hotel.latitude;
        hotel.longitude = req.body.hotel.longitude;
        hotel.nameSpace = req.body.hotel.nameSpace;
        hotel.save().then(hotelUpdate => {
            Facilities.findOne({"hotelObj._id": id}, function (err, facilitie) {
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
                    RoomDetails.deleteMany({"hotelObj._id": id}, function (err, success) {
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
                                    lstImg: item.lstImg,
                                    bedroomDetail: bedRoomDetails,
                                    roomAirConditional: item.roomAirConditional,
                                    roomHairdryer: item.roomHairdryer,
                                    roomIroningMachine: item.roomIroningMachine,
                                    roomTelevison: item.roomTelevison,
                                    roomCableTV: item.roomCableTV,
                                    roomFreeWifi: item.roomFreeWifi,
                                    roomTea: item.roomTea,
                                    roomCoffee: item.roomCoffee,
                                    roomShampoo: item.roomShampoo,
                                    roomBeddingSet: item.roomBeddingSet,
                                    roomTowelsOfAllKinds: item.roomTowelsOfAllKinds,
                                    roomWardrobe: item.roomWardrobe,
                                    roomPrivatePool: item.roomPrivatePool,
                                    roomHeaters: item.roomHeaters,
                                    roomDryer: item.roomDryer,
                                    roomTeaMaker: item.roomTeaMaker,
                                    roomSmartKey: item.roomSmartKey,
                                    roomFreeBreakfast: item.roomFreeBreakfast,
                                    roomWorkspace: item.roomWorkspace,
                                    roomFireplace: item.roomFireplace,
                                    roomHotTub: item.roomHotTub,
                                    roomType: item.roomType
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
                                status: 200,
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
        // console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getHotelSearch = (async (req, res) => {
    await Hotels.find().then(hotel => {
        res.status(200).send(hotel)
    }).catch(err => {
        // console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getHotelFind = (async (req, res) => {
    const searchOpts = req.body.searchOption;
    searchOpts.nameSpace = searchOpts.nameSpace.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    searchOpts.nameSpace = searchOpts.nameSpace.toLowerCase();
    const name = searchOpts.nameSpace.split(' ');
    searchOpts.nameSpace = name.join('-');
    let hotelList = [];
    await Hotels.find({status: 1}).then(async (hotel) => {
        for (let item of hotel) {
            let nameSpace = item.nameSpace;
            let countRating = 0
            await Booking.find({
                hotelNameSpace: nameSpace,
                status: '2',
                rating: {$gt: 0}
            }, function (err, listBooking) {
                countRating = listBooking.length;
            })
            countRating = countRating === 0 ? 1 : countRating;
            if (nameSpace.includes(searchOpts.nameSpace) === true) {
                const id = mongoose.Types.ObjectId(item._id);
                const rooms = await this.getRoom(id);
                let pass = false;
                rooms.forEach(room => {
                    if (room.accommodates >= searchOpts.personCount && rooms.length >= searchOpts.roomCount) {
                        pass = true;
                    }
                });
                if (pass === true) {
                    const facilities = await this.getFaciliti(id);
                    const object = {
                        hotel: item,
                        roomDetail: rooms,
                        faciliti: facilities,
                        countRating: countRating
                    }
                    hotelList.push(object);
                }
            }
        }
        return res.send({
            hotels: hotelList,
            status: 200,
            message: 'Tìm kiếm khách sạn thành công!'
        });
    }).catch(err => {
        // console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getHotelFindAll = (async (req, res) => {
    let hotelList = [];
    await Hotels.find({status: 1}).then(async (hotel) => {
        for (let item of hotel) {
            const id = mongoose.Types.ObjectId(item._id);
            const rooms = await this.getRoom(id);
            const facilities = await this.getFaciliti(id);
            const object = {
                hotel: item,
                roomDetail: rooms,
                faciliti: facilities
            }
            hotelList.push(object);
        }
        return res.send({
            hotels: hotelList,
            status: 200,
            message: 'Tìm kiếm khách sạn thành công!'
        });
    }).catch(err => {
        console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getBookingByUser = (async (req, res) => {
    // const UserObjId = mongoose.Types.ObjectId(req.params.id);
    await Booking.find({
        "hotelUser": req.params.email
    }).sort({
        createdAt: -1
    }).then(booking => {
        res.status(200).send(booking)
    }).catch(err => {
        console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getBookingAdmin = (async (req, res) => {
    await Booking.find().sort({
        createdAt: -1
    }).then(booking => {
        res.status(200).send(booking)
    }).catch(err => {
        console.log('not found booking');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding booking'
        })
    })
});

exports.getBookingByUserRegister = (async (req, res) => {
    // const UserObjId = mongoose.Types.ObjectId(req.params.id);
    await Booking.find({
        "userUpdateId": req.params.id
    }).sort({
        createdAt: -1
    }).then(booking => {
        res.status(200).send(booking)
    }).catch(err => {
        console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getBookingById = (async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    await Booking.findOne({
        _id: id
    }).then(booking => {
        Hotels.findOne({nameSpace: booking.hotelNameSpace}).then(hotel => {
            booking.hotelName = hotel.name;
            booking.hotelAddress = hotel.address;
            const idRoom = mongoose.Types.ObjectId(booking.roomDetailID)
            RoomDetails.findOne({_id: idRoom}).then(room => {
                booking.roomType = room.roomType;
                booking.cancellationPolicy = room.hotelObj.cancellationPolicy;
                const result = {
                    booking: booking,
                    hotelName: hotel.name,
                    hotelAddress: hotel.address,
                    roomType: room.roomType,
                    cancellationPolicy: room.hotelObj.cancellationPolicy,
                    img: hotel.image.split(',', 1).toString()
                }
                // console.log('khà khà');
                // console.log(result)
                return res.send({
                    status: 200,
                    booking: result
                })
            })

        })

    }).catch(err => {
        console.log('not found hotel');
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding hotel'
        })
    })
});

exports.getHotelByUser = (async (req, res) => {

    const UserObjId = mongoose.Types.ObjectId(req.params.id);

    await Hotels.find({
        "user._id": UserObjId
    }).then(hotel => {
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
    const hotelObjId = req.params.id;
    let objectRes = []
    let tienNghi = new Facilities;
    let listRoomDetails = [];
    try {
        await Facilities.find({
            "hotelObj.nameSpace": hotelObjId
        }).then(
            facilities => {
                if (facilities.length === 0) {
                    return res.send({
                        status: 404,
                        message: 'Some error occurred while finding hotel'
                    })
                }
                tienNghi = facilities
            }
        ).then(
            await RoomDetails.find({
                "hotelObj.nameSpace": hotelObjId
            }).then(
                roomDetails => {
                    listRoomDetails.push(roomDetails)
                }
            )
        )
        let countRating = 0
        await Booking.find({
            hotelNameSpace: hotelObjId,
            status: '2',
            rating: {$gt: 0}
        }, function (err, listBooking) {
            countRating = listBooking.length;
        })
        objectRes.push(tienNghi);
        objectRes.push(listRoomDetails)
        objectRes.push(countRating)
        return res.send({
            status: 200,
            result: objectRes
        })
    } catch (error) {
        res.send({
            'status': 404,
            'message': error.message || 'Some error occurred while finding facilities'
        })
    }
};

exports.updateRatingInBooking = async (req, res) => {
    var idBook = mongoose.Types.ObjectId(req.body.object.idBook);
    var idHotel = req.body.object.hotelId;
    var rating = req.body.object.rating;
    await Booking.findOne({_id: idBook}, async function (err, book) {
        if (err || book === null) {
            return res.send({
                status: 401,
                message: 'Không thể tìm thấy bản ghi!'
            });
        } else {
            book.rating = rating
            book.save().then(booking => {
                // update rating ở trong facilities
                Hotels.findOne({nameSpace: idHotel}, function (err, hotel) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: err
                        });
                    } else {
                        Booking.find({
                            hotelNameSpace: idHotel,
                            status: '2',
                            rating: {$gt: 0}
                        }, function (err, listBooking) {
                            const count = listBooking.length;
                            let point = 0;
                            listBooking.forEach(item => {
                                point += item.rating;
                            })
                            point = point / count;
                            hotel.pointRating = point;
                            hotel.save().then(hotels => {
                                Facilities.findOne({"hotelObj.nameSpace": idHotel}, function (err, facilitie) {
                                    if (err) {
                                        return res.send({
                                            status: 401,
                                            message: err
                                        });
                                    } else {
                                        facilitie.hotelObj = hotels;
                                        facilitie.save().then(faciday => {
                                            res.send({
                                                message: 'Đánh giá thành công khách sạn'
                                            })
                                        })
                                    }
                                })
                            })
                        });
                    }
                })
            })
        }
    })
}

exports.updateStatusBooking = async (req, res) => {
    var idBook = mongoose.Types.ObjectId(req.body.booking.idBooking);
    var emailUser = req.body.booking.idUserBook
    var emailUserHotel = req.body.booking.idUserHotel
    var actionName = req.body.booking.actionName
    var payReturnMoney = req.body.booking.payMonneyReturn
    await Booking.findOne({_id: idBook}, async function (err, book) {
        if (err || book === null) {
            return res.send({
                status: 401,
                message: 'Không thể tìm thấy bản ghi!'
            });
        } else {
            let message = new Messages({
                user: emailUser,
                content: '',
                imageUrl: '',
                videoUrl: '',
                news: 0
            });
            let messageUse = new Messages({
                user: book.email,
                content: '',
                imageUrl: '',
                videoUrl: '',
                news: 1
            });
            let messageAdmin = new Messages({
                user: emailUserHotel,
                content: '',
                imageUrl: '',
                videoUrl: '',
                news: 1
            });
            const roomDetail = await this.getRoomByID(book.roomDetailID)
            if (actionName === 'Chấp nhận') {
                let nameTypeRoom = ''
                if (roomDetail.roomType == 1) {
                    nameTypeRoom = 'Phòng tiêu chuẩn'
                }
                if (roomDetail.roomType == 2) {
                    nameTypeRoom = 'Phòng view đẹp'
                }
                if (roomDetail.roomType == 3) {
                    nameTypeRoom = 'Phòng cao cấp'
                }
                if (roomDetail.roomType == 4) {
                    nameTypeRoom = 'Phòng siêu sang'
                }
                if (roomDetail.roomType == 5) {
                    nameTypeRoom = 'Phòng đôi'
                }
                if (roomDetail.roomType == 6) {
                    nameTypeRoom = 'Phòng Tổng thống'
                }
                if (roomDetail.roomType == 7) {
                    nameTypeRoom = 'Phòng Hoàng gia'
                }
                book.status = 1;
                message.content = 'Yêu cầu đặt phòng của bạn thành công. Vui lòng kiểm tra email để hoàn thành thủ tục đặt phòng'
                message.news = 1
                messageAdmin.content = 'Xét duyệt yêu cầu đặt phòng thành công';

                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'booking.hotel.com.2020@gmail.com',
                        pass: 'Longquang123'
                    }
                });
                let mailOptions = {
                    from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                    to: emailUser, // list of receivers
                    subject: 'Chào mừng đến trang web Booking', // Subject line
                    text: req.body.body, // plain text body
                    html: 'Chúc mừng bạn ' + book.name + ' đã đặt phòng thành công. <br> Thông tin phòng của quý khách là:' +
                        '<br> Tên khách sạn: ' + roomDetail.hotelObj.name +
                        '<br> Địa chỉ: ' + roomDetail.hotelObj.address +
                        '<br> Thông tin phòng đặt: ' +
                        '<br> -Hạng phòng: ' + nameTypeRoom +
                        '<br> -Số lượng: ' + book.totalAmountRoom +
                        '<br> -Từ ngày: ' + book.date.begin +
                        '<br> -Đến ngày: ' + book.date.end +
                        '<br> -Tổng tiền: ' + book.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'VND' +
                        '<br> -Trạng thái: Chưa thanh toán' +
                        '<br> Xin vui lòng ấn vào link này để thanh toán hóa đơn.' +
                        '<a href="https://localhost:4200/pay/' + idBook + '#' + book.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '">Thanh toán tại đây</a>' +
                        '<br> Link thanh toán sẽ hết hạn trong vòng 1h. Hệ thống sẽ tự hủy giao dịch đặt phòng của quý khách.'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
                book.save((async function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: actionName + ' không thành công!'
                        });
                    } else {
                        let messageToUserUpdate = new Messages({
                            user: '',
                            content: 'Yêu cầu đặt phòng của bạn thành công. Vui lòng kiểm tra email để hoàn thành thủ tục đặt phòng!!',
                            imageUrl: '',
                            videoUrl: '',
                            news: 1
                        });
                        if (book.userUpdateId != '' && book.userUpdateId != null) {
                            const id = mongoose.Types.ObjectId(book.userUpdateId);
                            await Users.findOne({_id: id}, function (err, user) {
                                if (err || user === null || book.email == user.email) {
                                    console.log(err);
                                } else {
                                    messageToUserUpdate.user = user.email;
                                    message.user = user.email
                                }
                            })
                        }
                        await message.save().then(newMessage => {
                            messageAdmin.save().then(newMessageAdmin => {
                                return res.send({
                                    status: 200,
                                    book: book,
                                    message: newMessage,
                                    messageUseUpadte: messageToUserUpdate,
                                    messageAdmin: newMessageAdmin
                                });
                            }).catch(err => {
                                return res.send({
                                    status: 404,
                                    message: err.message || 'Some error occurred while save messageAdmin'
                                });
                            });
                        }).catch(err => {
                            return res.send({
                                status: 404,
                                message: err.message || 'Some error occurred while save message'
                            });
                        });
                    }
                }))

            }
            if (actionName === 'Từ chối') {
                let nameTypeRoom = ''
                if (roomDetail.roomType == 1) {
                    nameTypeRoom = 'Phòng tiêu chuẩn'
                }
                if (roomDetail.roomType == 2) {
                    nameTypeRoom = 'Phòng view đẹp'
                }
                if (roomDetail.roomType == 3) {
                    nameTypeRoom = 'Phòng cao cấp'
                }
                if (roomDetail.roomType == 4) {
                    nameTypeRoom = 'Phòng siêu sang'
                }
                if (roomDetail.roomType == 5) {
                    nameTypeRoom = 'Phòng đôi'
                }
                if (roomDetail.roomType == 6) {
                    nameTypeRoom = 'Phòng Tổng thống'
                }
                if (roomDetail.roomType == 7) {
                    nameTypeRoom = 'Phòng Hoàng gia'
                }
                book.status = -1;
                message.content = 'Rất tiếc. Khách sạn không đáp ứng đủ khả năng yêu cầu của quý khách. Xin quý khách thông cảm!'
                message.news = 1
                messageAdmin.content = 'Từ chối đơn đặt phòng thành công';
                messageUse.content = 'Rất tiếc. Khách sạn không đáp ứng đủ khả năng yêu cầu của quý khách. Xin quý khách thông cảm!'
                ;

                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'booking.hotel.com.2020@gmail.com',
                        pass: 'Longquang123'
                    }
                });
                let mailOptions = {
                    from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                    to: emailUser, // list of receivers
                    subject: 'Chào mừng đến trang web Booking', // Subject line
                    text: req.body.body, // plain text body
                    html: 'Chào bạn ' + book.name + ' <br> Thông tin phòng của quý khách là:' +
                        '<br> Tên khách sạn: ' + roomDetail.hotelObj.name +
                        '<br> Địa chỉ: ' + roomDetail.hotelObj.address +
                        '<br> Thông tin phòng đặt: ' +
                        '<br> -Hạng phòng: ' + nameTypeRoom +
                        '<br> -Số lượng: ' + book.totalAmountRoom +
                        '<br> -Từ ngày: ' + book.date.begin +
                        '<br> -Đến ngày: ' + book.date.end +
                        '<br> -Tổng tiền: ' + book.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'VND' +
                        '<br> -Trạng thái: Đã hủy' +
                        '<br> -Nội dung: Đơn đặt phòng của bạn không thành công. Lý do: Khách sạn đã hết phòng không đáp ứng đủ nhu cầu đặt phòng của quý khách!! ' +
                        '<br> Mong quý khách thông cảm' +
                        '<br> Chúng tôi chân thành cảm ơn!!'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });

                let messageToUserUpdate = new Messages({
                    user: '',
                    content: 'Rất tiếc. Khách sạn không đáp ứng đủ khả năng yêu cầu của quý khách. Xin quý khách thông cảm!!',
                    imageUrl: '',
                    videoUrl: '',
                    news: 1
                });

                if (book.userUpdateId !== '' && book.userUpdateId != null) {
                    const id = mongoose.Types.ObjectId(book.userUpdateId);
                    Users.findOne({_id: id}, function (err, user) {
                        if (err || user === null || book.email == user.email) {
                            console.log(err);
                        } else {
                            // messageToUserUpdate.user = user.email;
                            // messageToUserUpdate.save();
                            message.user = user.email
                        }
                    })
                }

                book.save((function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: actionName + ' không thành công!'
                        });
                    } else {
                        message.save().then(newMessage => {
                            messageAdmin.save().then(newMessageAdmin => {
                                return res.send({
                                    status: 200,
                                    book: book,
                                    message: newMessage,
                                    messageAdmin: newMessageAdmin,
                                    messageUseUpadte: messageToUserUpdate,
                                });
                            }).catch(err => {
                                return res.send({
                                    status: 404,
                                    message: err.message || 'Some error occurred while save messageAdmin'
                                });
                            });
                        }).catch(err => {
                            return res.send({
                                status: 404,
                                message: err.message || 'Some error occurred while save message'
                            });
                        });
                    }
                }))

            }
            if (actionName === 'Thanh toán') {
                let nameTypeRoom = ''
                if (roomDetail.roomType == 1) {
                    nameTypeRoom = 'Phòng tiêu chuẩn'
                }
                if (roomDetail.roomType == 2) {
                    nameTypeRoom = 'Phòng view đẹp'
                }
                if (roomDetail.roomType == 3) {
                    nameTypeRoom = 'Phòng cao cấp'
                }
                if (roomDetail.roomType == 4) {
                    nameTypeRoom = 'Phòng siêu sang'
                }
                if (roomDetail.roomType == 5) {
                    nameTypeRoom = 'Phòng đôi'
                }
                if (roomDetail.roomType == 6) {
                    nameTypeRoom = 'Phòng Tổng thống'
                }
                if (roomDetail.roomType == 7) {
                    nameTypeRoom = 'Phòng Hoàng gia'
                }

                book.status = 2;
                // message.content = 'Khách hàng đã thanh toán thành công. Xin cảm ơn'
                message.news = 1
                message.content = 'Khách hàng đã thanh toán thành công loại phòng: ' + nameTypeRoom
                    + ' Tên khách sạn: ' + roomDetail.hotelObj.name
                    + ' Số lượng: ' + book.totalAmountRoom
                    + ' Từ ngày: ' + book.date.begin
                    + ' Đến ngày: ' + book.date.end +
                    ' Xin cảm ơn.'
                ;
                messageAdmin.news = 1
                messageAdmin.user = book.hotelUser
                messageAdmin.content = 'Khách hàng ' + book.email + ' đã thanh toán loại phòng của bạn: ' + nameTypeRoom +
                    ' Số lượng: ' + book.totalAmountRoom +
                    ' Từ ngày: ' + book.date.begin +
                    ' Đến ngày: ' + book.date.end
                ;

                let messageToUserUpdate = new Messages({
                    user: '',
                    content: 'Khách hàng đã thanh toán thành công loại phòng: ' + nameTypeRoom
                        + ' Tên khách sạn: ' + roomDetail.hotelObj.name
                        + ' Số lượng: ' + book.totalAmountRoom
                        + ' Từ ngày: ' + book.date.begin
                        + ' Đến ngày: ' + book.date.end +
                        ' Xin cảm ơn.',
                    imageUrl: '',
                    videoUrl: '',
                    news: 1
                });
                message.user = book.email
                console.log('óc óc óc óc ')
                console.log(message);
                if (book.userUpdateId !== '' && book.userUpdateId != null) {
                    const id = mongoose.Types.ObjectId(book.userUpdateId);
                    Users.findOne({_id: id}, function (err, user) {
                        if (err || user === null || book.email == user.email) {
                            console.log(err);
                        } else {
                            message.user = user.email
                        }
                    }).then(() => {
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'booking.hotel.com.2020@gmail.com',
                                pass: 'Longquang123'
                            }
                        });
                        let mailOptions = {
                            from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                            to: book.email, // list of receivers
                            subject: 'Chào mừng đến trang web Booking', // Subject line
                            text: req.body.body, // plain text body
                            html: 'Bạn đã thanh toán thành công loại phòng ' + nameTypeRoom +
                                '<br> -Tên khách sạn: ' + roomDetail.hotelObj.name +
                                '<br> -Số lượng: ' + book.totalAmountRoom +
                                '<br> -Từ ngày: ' + book.date.begin +
                                '<br> -Đến ngày: ' + book.date.end +
                                '<br> -Tổng tiền: ' + book.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'VND' +
                                '<br> Nếu bạn muốn hủy phòng :' +
                                '<a href="https://localhost:4200/pay/' + idBook + '">Hủy phòng tại đây</a>'

                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                        console.log('Gửi mail nè')
                    })
                } else {
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'booking.hotel.com.2020@gmail.com',
                            pass: 'Longquang123'
                        }
                    });
                    let mailOptions = {
                        from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                        to: message.user, // list of receivers
                        subject: 'Chào mừng đến trang web Booking', // Subject line
                        text: req.body.body, // plain text body
                        html: 'Bạn đã thanh toán thành công loại phòng ' + nameTypeRoom +
                            '<br> -Tên khách sạn: ' + roomDetail.hotelObj.name +
                            '<br> -Số lượng: ' + book.totalAmountRoom +
                            '<br> -Từ ngày: ' + book.date.begin +
                            '<br> -Đến ngày: ' + book.date.end +
                            '<br> -Tổng tiền: ' + book.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'VND' +
                            '<br> Nếu bạn muốn hủy phòng :' +
                            '<a href="https://localhost:4200/pay/' + idBook + '">Hủy phòng tại đây</a>'

                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                    console.log('Gửi mail nè')
                }

                book.save((function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: actionName + ' không thành công!'
                        });
                    } else {
                        message.save().then(newMessage => {
                            messageAdmin.save().then(newMessageAdmin => {
                                return res.send({
                                    status: 200,
                                    book: book,
                                    message: newMessage,
                                    messageAdmin: newMessageAdmin,
                                    messageUseUpadte: messageToUserUpdate,
                                    hotelUSe: book.hotelUser
                                });
                            }).catch(err => {
                                return res.send({
                                    status: 404,
                                    message: err.message || 'Some error occurred while save messageAdmin'
                                });
                            });
                        }).catch(err => {
                            return res.send({
                                status: 404,
                                message: err.message || 'Some error occurred while save message'
                            });
                        });
                    }
                }))
            }
            if (actionName === 'Hủy phòng') { // hotel duyệt người dùng từ chối
                let nameTypeRoom = ''
                if (roomDetail.roomType == 1) {
                    nameTypeRoom = 'Phòng tiêu chuẩn'
                }
                if (roomDetail.roomType == 2) {
                    nameTypeRoom = 'Phòng view đẹp'
                }
                if (roomDetail.roomType == 3) {
                    nameTypeRoom = 'Phòng cao cấp'
                }
                if (roomDetail.roomType == 4) {
                    nameTypeRoom = 'Phòng siêu sang'
                }
                if (roomDetail.roomType == 5) {
                    nameTypeRoom = 'Phòng đôi'
                }
                if (roomDetail.roomType == 6) {
                    nameTypeRoom = 'Phòng Tổng thống'
                }
                if (roomDetail.roomType == 7) {
                    nameTypeRoom = 'Phòng Hoàng gia'
                }

                book.status = -2;
                message.content = 'Khách hàng đã hủy phòng thành công. Xin cảm ơn'
                messageUse.content = 'Khách hàng đã hủy  phòng thành công. Xin cảm ơn';
                messageAdmin.content = 'Khách hàng ' + book.email + ' đã hủy loại phòng của bạn: ' + nameTypeRoom +
                    ' Số lượng: ' + book.totalAmountRoom +
                    ' Từ ngày: ' + book.date.begin +
                    ' Đến ngày: ' + book.date.end
                ;
                let messageToUserUpdate = new Messages({
                    user: '',
                    content: 'Khách hàng đã hủy phòng thành công. Xin cảm ơn!',
                    imageUrl: '',
                    videoUrl: '',
                    news: 1
                });
                if (book.userUpdateId != '' && book.userUpdateId != null) {
                    const id = mongoose.Types.ObjectId(book.userUpdateId);
                    Users.findOne({_id: id}, function (err, user) {
                        if (err || user === null || book.email == user.email) {
                            console.log(err);
                        } else {
                            message.user = user.email
                        }
                    })
                }
                messageAdmin.user = book.hotelUser
                book.save((function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: actionName + ' không thành công!'
                        });
                    } else {
                        message.save().then(newMessage => {
                            // messageUse.save()
                            return res.send({
                                status: 200,
                                book: book,
                                message: newMessage,
                                messageAdmin: messageAdmin, // người dùng book nhưng từ chối thanh toán thì k cần
                                hotelUSe: book.hotelUser
                                // messageAdmin.save().then(newMessageAdmin => {}
                            }).catch(err => {
                                return res.send({
                                    status: 404,
                                    message: err.message || 'Some error occurred while save messageAdmin'
                                });
                            });
                        }).catch(err => {
                            return res.send({
                                status: 404,
                                message: err.message || 'Some error occurred while save message'
                            });
                        });
                    }
                }))
            } // của người dùng chưa thanh toán
            if (actionName === 'Pay Cancel') { // của người dùng đã thanh toán xog rồi hủy phòng
                let nameTypeRoom = ''
                if (roomDetail.roomType == 1) {
                    nameTypeRoom = 'Phòng tiêu chuẩn'
                }
                if (roomDetail.roomType == 2) {
                    nameTypeRoom = 'Phòng view đẹp'
                }
                if (roomDetail.roomType == 3) {
                    nameTypeRoom = 'Phòng cao cấp'
                }
                if (roomDetail.roomType == 4) {
                    nameTypeRoom = 'Phòng siêu sang'
                }
                if (roomDetail.roomType == 5) {
                    nameTypeRoom = 'Phòng đôi'
                }
                if (roomDetail.roomType == 6) {
                    nameTypeRoom = 'Phòng Tổng thống'
                }
                if (roomDetail.roomType == 7) {
                    nameTypeRoom = 'Phòng Hoàng gia'
                }

                book.status = 3;
                // message.content = 'Khách hàng đã thanh toán thành công. Xin cảm ơn'
                message.news = 1
                // console.log(book.date.begin)
                // console.log(book.date.end)
                message.content = 'Khách hàng đã hủy thành công loại phòng: ' + nameTypeRoom
                    + ' Tên khách sạn: ' + roomDetail.hotelObj.name
                    + ' Số lượng: ' + book.totalAmountRoom
                    + ' Từ ngày: ' + book.date.begin
                    + ' Đến ngày: ' + book.date.end
                    + ' Số tiền trả lại: ' + payReturnMoney

                messageAdmin.news = 1
                messageAdmin.user = book.hotelUser
                messageAdmin.content = 'Khách hàng ' + book.email + ' đã hủy loại phòng của bạn: ' + nameTypeRoom +
                    ' Số lượng: ' + book.totalAmountRoom +
                    ' Từ ngày: ' + book.date.begin +
                    ' Đến ngày: ' + book.date.end +
                    ' Số tiền trả lại: ' + payReturnMoney
                ;

                let messageToUserUpdate = new Messages({
                    user: '',
                    content: 'Khách hàng đã hủy thành công loại phòng: ' + nameTypeRoom
                        + ' Tên khách sạn: ' + roomDetail.hotelObj.name
                        + ' Số lượng: ' + book.totalAmountRoom
                        + ' Từ ngày: ' + book.date.begin
                        + ' Đến ngày: ' + book.date.end
                        + ' Số tiền trả lại: ' + payReturnMoney
                        + ' Xin cảm ơn.',
                    imageUrl: '',
                    videoUrl: '',
                    news: 1
                });
                message.user = book.email
                if (book.userUpdateId !== '' && book.userUpdateId != null) {
                    const id = mongoose.Types.ObjectId(book.userUpdateId);
                    Users.findOne({_id: id}, function (err, user) {
                        if (err || user === null || book.email == user.email) {
                        } else {
                            message.user = user.email
                        }
                    }).then(() => {
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'booking.hotel.com.2020@gmail.com',
                                pass: 'Longquang123'
                            }
                        });
                        let mailOptions = {
                            from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                            to: book.email, // list of receivers
                            subject: 'Chào mừng đến trang web Booking', // Subject line
                            text: req.body.body, // plain text body
                            html: 'Bạn đã hủy thành công loại phòng ' + nameTypeRoom +
                                '<br> -Tên khách sạn: ' + roomDetail.hotelObj.name +
                                '<br> -Số lượng: ' + book.totalAmountRoom +
                                '<br> -Từ ngày: ' + book.date.begin +
                                '<br> -Đến ngày: ' + book.date.end +
                                '<br> -Tổng tiền: ' + book.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'VND' +
                                '<br> -Số tiền trả lại: ' + payReturnMoney
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                    })
                }
                book.save((function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: actionName + ' không thành công!'
                        });
                    } else {
                        message.save().then(newMessage => {
                            messageAdmin.save().then(newMessageAdmin => {
                                return res.send({
                                    status: 200,
                                    book: book,
                                    message: newMessage,
                                    messageAdmin: newMessageAdmin,
                                    messageUseUpadte: messageToUserUpdate,
                                    hotelUSe: book.hotelUser
                                });
                            }).catch(err => {
                                console.log('false to save messageAdmin');
                                return res.send({
                                    status: 404,
                                    message: err.message || 'Some error occurred while save messageAdmin'
                                });
                            });
                        }).catch(err => {
                            console.log('false to save message');
                            return res.send({
                                status: 404,
                                message: err.message || 'Some error occurred while save message'
                            });
                        });
                    }
                }))
            }
        }
    })
}

exports.updateStatusHotel = async (req, res) => {
    var idUser = mongoose.Types.ObjectId(req.body.hotel.idUser);
    var idHotel = mongoose.Types.ObjectId(req.body.hotel.idHotel);
    var actionName = req.body.hotel.actionName;
    await Hotels.findOne({_id: idHotel}, function (err, hotel) {
        if (err || hotel === null) {
            return res.send({
                status: 401,
                message: 'Không thể tìm thấy khách sạn!'
            });
        } else {

            Users.findOne({_id: idUser}, function (err, user) {
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
                    let message = new Messages({
                        user: hotel.user.email,
                        content: '',
                        imageUrl: '',
                        videoUrl: '',
                        news: 0
                    });
                    let messageAdmin = new Messages({
                        user: user.email,
                        content: '',
                        imageUrl: '',
                        videoUrl: '',
                        news: 1
                    });
                    if (actionName === 'Duyệt') {
                        hotel.status = 1;
                        message.content = 'Chúc mừng bạn đã được hệ thống duyệt khách sạn ' + hotel.name;
                        messageAdmin.content = 'Bạn đã duyệt thành công khách sạn ' + hotel.name + ' của thành viên ' + hotel.user.email;
                    } else if (actionName === 'Bỏ duyệt') {
                        hotel.status = 0;
                        message.content = 'Khác sạn ' + hotel.name + ' của bạn đã bị hệ thống cho ngừng hoạt động!';
                        messageAdmin.content = 'Bạn đã bỏ duyệt thành công khách sạn ' + hotel.name + ' của thành viên ' + hotel.user.email;
                    } else if (actionName === 'Khóa') {
                        hotel.isBlock = 0;
                        hotel.status = -2;
                        message.content = 'Khách sạn ' + hotel.name + ' của bạn đã bị hệ thống khóa!';
                        messageAdmin.content = 'Bạn đã khóa thành công khách sạn ' + hotel.name + ' của thành viên ' + hotel.user.email;
                    } else if (actionName === 'Mở khóa') {
                        hotel.isBlock = 1;
                        hotel.status = 1;
                        message.content = 'Chúc mừng bạn đã được mở khóa khách sạn ' + hotel.name;
                        messageAdmin.content = 'Bạn đã được hệ thống mở khóa thành công khách sạn ' + hotel.name + ' của thành viên ' + hotel.user.email;
                    }
                    hotel.save((function (err) {
                        if (err) {
                            return res.send({
                                status: 401,
                                message: actionName + ' khách sạn không thành công!'
                            });
                        } else {
                            message.save().then(newMessage => {
                                messageAdmin.save().then(newMessageAdmin => {
                                    return res.send({
                                        status: 200,
                                        hotel: hotel,
                                        message: newMessage,
                                        messageAdmin: newMessageAdmin
                                    });
                                }).catch(err => {
                                    console.log('false to save messageAdmin');
                                    return res.send({
                                        status: 404,
                                        message: err.message || 'Some error occurred while save messageAdmin'
                                    });
                                });
                            }).catch(err => {
                                console.log('false to save message');
                                return res.send({
                                    status: 404,
                                    message: err.message || 'Some error occurred while save message'
                                });
                            });
                        }
                    }));
                }
            });
        }
    });
};

// callback

// đây là của long đz
getUserByEmail = function (email) {
    return Users.findOne({email: email});
}

getRoomByID = function (id) {
    return RoomDetails.findOne({_id: id});
}

getHotelByNameSpace = function (namespc) {
    return Hotels.findOne({nameSpace: namespc});
}

// ở dưới là của quang ngáo
exports.getRoom = function (id) {
    return RoomDetails.find({"hotelObj._id": id});
}
exports.getFaciliti = function (id) {
    return Facilities.findOne({"hotelObj._id": id});
}

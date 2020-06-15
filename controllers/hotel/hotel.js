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
    touristAttraction: req.body.hotel.touristAttraction,
    sqm: req.body.hotel.sqm,
    country: req.body.hotel.country,
    province: req.body.hotel.province,
    city: req.body.hotel.city,
    zip: req.body.hotel.zip,
    desHotel: req.body.hotel.desHotel,
    suggestPlayground: req.body.hotel.suggestPlayground,
    rulerHotel: req.body.hotel.rulerHotel,
    guideToHotel: req.body.hotel.guideToHotel,
    starHotel: req.body.hotel.starHotel,
    pointRating: req.body.hotel.pointRating,
    imageUrl: req.body.hotel.imageUrl,
    maxDay: req.body.hotel.maxDay,
    status: req.body.hotel.status
  });

  const roomDetail = new RoomDetails({
    capacity: req.body.roomDetail.capacity,
    bathroom: req.body.roomDetail.bathroom,
    promotion: req.body.roomDetail.promotion,
    price: req.body.roomDetail.price,
    priceExtra: req.body.roomDetail.priceExtra,
    bedroom: req.body.roomDetail.bedroom,
    bedroomDetail: req.body.roomDetail.bedroomDetail
  });

  const faciliti = new Facilities({
    airconditioner: req.body.facilities.airconditioner,
    television: req.body.facilities.television,
    internet: req.body.facilities.internet,
    beddingSet: req.body.facilities.beddingSet,
    dryer: req.body.facilities.dryer,
    cableTelevision: req.body.facilities.cableTelevision,
    washingMachine: req.body.facilities.washingMachine,
    cloth: req.body.facilities.cloth,
    flatIron: req.body.facilities.flatIron,
    shampoo: req.body.facilities.shampoo,
    smartKey: req.body.facilities.smartKey,
    coffeeMaker: req.body.facilities.coffeeMaker,
    teaMaker: req.body.facilities.teaMaker,
    tea: req.body.facilities.tea,
    coffee: req.body.facilities.coffee,
    freeBreakfast: req.body.facilities.freeBreakfast,
    kitchen: req.body.facilities.kitchen,
    smokeAlarmSensor: req.body.facilities.smokeAlarmSensor,
    fireExtinguisher: req.body.facilities.fireExtinguisher,
    firstAidKit: req.body.facilities.firstAidKit,
    coAlarm: req.body.facilities.coAlarm
  });
  const reservationTime = new ReservationTimes({
    anyTime: req.body.reservationTime.anyTime,
    oneYear: req.body.reservationTime.oneYear,
    sixMonth: req.body.reservationTime.sixMonth,
    threeMonth: req.body.reservationTime.threeMonth
  });
  const cancelRoom = new CancelRooms({
    flexible: req.body.cancelRoom.flexible,
    strict: req.body.cancelRoom.strict
  });
  Users.findOne({ email: req.body.hotel.userEmail }, function (err, userSchema) {
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
        roomDetail.hotelObj = hotel;
        roomDetail.save().then(() => {
          faciliti.hotelObj = hotel;
          faciliti.save().then(() => {
            reservationTime.hotelObj = hotel;
            reservationTime.save().then(() => {
              cancelRoom.hotelObj = hotel;
              cancelRoom.save().then(() => {
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
            message: err.message || 'Some error occurred while creating the roomdetail'
          })
        });
      }).catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the hotel'
        })
      });
    }
  });


  // console.log(req.body.bedroomDetail);
  // const userId = req.email.toString();
  // console.log(userId);
  // console.log(roomDetail.bedroomDetail);
};
// exports.updateUser = async (req, res) => {
//   console.log('helo' + req.body.user.id);
//   const mongoose = require('mongoose');
//   const userObject = {
//     _id: req.body.user.id,
//     updateAccount: req.email,
//     name: req.body.user.name,
//     lastName: req.body.user.lastName,
//     birthday: req.body.user.birthday,
//     gender: req.body.user.gender,
//     materialStatus: req.body.user.materialStatus,
//     signature: req.body.user.signature,
//     introduction: req.body.user.introduction,
//     imageUrl: req.body.user.imageUrl,
//   };
//   const userId = req.userId.toString();
//   console.log(userId);
//   console.log(req.body.user.id);
//   if (userId !== req.body.user.id) {
//     return res.send({
//       'status': 401,
//       'message': 'Thí chú không có quyền. Vui lòng liên hệ admin nhé!'
//     })
//   }
//   const id = mongoose.Types.ObjectId(req.body.user.id);
//   await Users.findOne({ _id: id }, function (err, user) {
//     if (err || user === null) {
//       console.log(user);
//       return res.send({
//         'status': 401,
//         'message': 'Không tìm thấy tài khoản người dùng'
//       })
//     } else {
//       let check = false;
//       console.log(userObject);

//       user.updateAccount = req.email,
//         user.name = userObject.name,
//         user.lastName = userObject.lastName,
//         user.birthday = userObject.birthday,
//         user.gender = userObject.gender,
//         user.materialStatus = userObject.materialStatus,
//         user.signature = userObject.signature,
//         user.introduction = userObject.introduction,
//         user.imageUrl = userObject.imageUrl,
//         user.save((function (err) {
//           if (err) {
//             return res.send({
//               status: 401,
//               message: "Cập nhật thông tin tài khoản không thành công"
//             });
//           } else {
//             check = true;
//             return res.status(200).send({
//               status: 200,
//               user: user,
//               message: 'Cập nhật thông tin tài khoản thành công'
//             });
//           }
//         }));
//       Recipe.find()
//         .sort({ status: 1 })
//         .limit(100)
//         .then(recipes => {
//           recipes.forEach(recipe => {
//             if (recipe.user.email === user.email) {
//               console.log('update công thức' + recipe.recipeName);
//               recipe.user = user;
//               recipe.save((function (err) {
//                 if (err) {
//                   console.log('update công thức thất bại' + recipe.recipeName);
//                 } else {
//                   console.log('update công thức thành công' + recipe.recipeName);
//                 }
//               }));
//             }
//           })
//         }).catch(() => {
//           console.log('lỗi khi update ảnh recipe');
//         });
//       Gallery.find()
//         .then(gallerys => {
//           gallerys.forEach(gallery => {
//             if (gallery.user.email === user.email) {
//               gallery.user = user;
//               const recipes = gallery.recipe;
//               console.log(gallery.recipe.length);
//               const arrayConfirm = null;
//               recipes.forEach(recipe => {
//                 console.log(recipe.recipeName + gallery.user.name);
//                 if (recipe.user.email === user.email) {
//                   recipe.user = user;
//                   console.log(recipe.recipeName)
//                 }
//               });
//               gallery.save((function (err) {
//                 if (err) {
//                   console.log('update bộ sưu tập thất bại' + gallery.name);
//                 } else {
//                   console.log('update bộ sưu tập thành công' + gallery.name);
//                 }
//               }));
//             }
//           });
//         }).catch(() => {
//           console.log('lỗi khi update ảnh recipe');
//         });
//     }
//   });
// };
// exports.getTopUsers = (async (req, res) => {
//   await Users.find({
//     role: {
//       $gte: 0
//     }, status: {
//       $gte: -1
//     }
//   })
//     .sort({ totalPoint: -1 })
//     .limit(10)
//     .then(users => {
//       res.status(200).send(users
//       )
//     }).catch(err => {
//       res.send({
//         'status': 404,
//         'message': err.message || 'Some error occurred while finding users'
//       })
//     })
// });
// exports.uploadImage = (async (req, res) => {

// });


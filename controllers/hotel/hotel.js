const mongoose = require("mongoose");
require("passport");
var md5 = require('md5');
const auth = require("../../routers/auth");
const Users = mongoose.model("Users");
const Hotels = mongoose.model("Hotels")
const RoomDetails = mongoose.model("RoomDetails")
// const Hotels = require("../models/hotel");
const Tokens = require("../../models/Token");
const nodeMailer = require('nodemailer');
const Recipe = require("../../models/recipe");
const Gallery = require("../../models/gallery");
const Summarys = mongoose.model('Summarys');
//POST new user route (optional, everyone has access)
const Messages = mongoose.model('Messages');

exports.createHotel = (req, res) => {
  const hotel = new Hotels({
    name: req.body.name,
    address: req.body.address,
    touristAttraction: req.body.touristAttraction,
    sqm: req.body.sqm,
    country: req.body.country,
    province: req.body.province,
    city: req.body.city,
    zip: req.body.zip,
    desHotel: req.body.desHotel,
    suggestPlayground: req.body.suggestPlayground,
    rulerHotel: req.body.rulerHotel,
    guideToHotel: req.body.guideToHotel,
    starHotel: req.body.starHotel,
    pointRating: req.body.pointRating,
    imageUrl: req.body.imageUrl,
    maxDay: req.body.maxDay,
    status: req.body.status,
    facilitie: req.body.facilitie,
    security: req.body.security,
    reservationTime: req.body.reservationTime,
    cancelRoom: req.body.cancelRoom
  });

  const roomDetail = new RoomDetails({
    hotelObjId: hotel._id,
    capacity: req.body.roomDetail.capacity,
    bathroom: req.body.roomDetail.bathroom,
    promotion: req.body.roomDetail.promotion,
    price: req.body.roomDetail.price,
    priceExtra: req.body.roomDetail.priceExtra,
    bedroom: req.body.roomDetail.bedroom,
    bedroomDetail: req.body.roomDetail.bedroomDetail
  });



 hotel.save().then(() => {
    res.status(200).send({
      hotel: hotel,
      mesage: "Thêm khách sạn thành công"
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the note'
    })
  });

  // console.log(req.body.bedroomDetail);
  // const userId = req.email.toString();
  // console.log(userId);
  // console.log(roomDetail.bedroomDetail);
  roomDetail.save().then(() => {
    res.status(200).send({
      roomDetail: roomDetail,
      mesage: "Thêm khách sạn thành công"
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the note'
    })
  });
  
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


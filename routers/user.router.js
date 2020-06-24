// const express = require('express')
// const User = require('../models/User')
// const auth = require('./auth')
// const router = express.Router()

// router.post('/users', async (req, res) => {
//     // Create a new user
//     try {
//         const user = new User(req.body)
//         await user.save()
//         const token = await user.generateAuthToken()
//         res.status(201).send({
//             user,
//             token,
//             message: 'save successful'
//         })
//     } catch (error) {
//         res.status(400).send({
//             message: 'loi khong xac dinh' || error
//         })
//     }
// })

// router.post('/users/login', async (req, res) => {
//     //Login a registered user
//     try {
//         const { email, password } = req.body
//         const user = await User.findByCredentials(email, password)
//         if (!user) {
//             return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
//         }
//         const token = await user.generateAuthToken()
//         res.send({ user, token })
//     } catch (error) {
//         res.status(400).send({
//             message: "loi khong xac dinh" || error
//         })
//     }

// })
// router.get('/users/me', auth, async (req, res) => {
//     // View logged in user profile
//     res.send(req.user)
// })
// router.post('/users/me/logout', auth, async (req, res) => {
//     // Log user out of the application
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token != req.token
//         })
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// router.post('/users/me/logoutall', auth, async (req, res) => {
//     // Log user out of all devices
//     try {
//         req.user.tokens.splice(0, req.user.tokens.length)
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })
// module.exports = router

// const express = require('express');
// const app = express();

// app.use('/api', require('./api'));

// module.exports = app;
var VerifyUserByToken = require(__root + 'auth/VerifyUserByToken');
var VerifyToken = require(__root + 'auth/VerifyToken');
var VerifyRoleByToken = require(__root + 'auth/VerifyRoleByToken');
module.exports = app => {
  const users = require("../controllers/users");
  app.post("/register", users.create);
  app.post("/createAdminAccount", users.createAdminAccount);
  app.get("/getUsers", VerifyRoleByToken, users.getUsers);
  app.post("/login", users.login);
  app.post("/testEmail",/* VerifyToken, */ users.testEmail);
  app.post("/loginAdmin", users.loginAdmin);
  // app.post("/addPoint", VerifyToken,users.addPoint);
  // app.post("/removePoint",VerifyToken, users.removePoint);
  app.post("/updateRole",/* VerifyRoleByToken, */ users.updateRole);
  app.post("/updateReport",/* VerifyRoleByToken, */ users.updateReport);
  app.post("/openUser",/* VerifyRoleByToken, */ users.openUser);
  // app.post("/bannedUser",VerifyRoleByToken, users.bannedUser);
  app.post("/updateUser", VerifyUserByToken, users.updateUser);
  app.post("/changePassword", VerifyUserByToken, users.changePassword);
  app.post("/resetPassword", users.resetPassword);
  app.get("/logout", users.logout);
  app.get("/getTopUsers", users.getTopUsers);
  app.get("/getNewUsers", users.getNewUsers);
  app.get('/active/:id', users.activeMember);
  app.get('/getMemerInfo/:email', users.getMemberInfo);

  // uploads
  // const base = 'http://localhost:8000/uploads'
  // const multipart = require('connect-multiparty');
  // const multipartMiddleware = multipart({ uploadDir: '../uploads' });
  // app.post('/upload', multipartMiddleware, (req, res) => {
  //   console.log(req.files);
  // });
};

const mongoose = require("mongoose");
require("passport");
var md5 = require('md5');
const auth = require("../routers/auth");
const Users = mongoose.model("Users");
const Tokens = require("../models/Token");
const nodeMailer = require('nodemailer');
const Recipe = require("../models/recipe");
const Gallery = require("../models/gallery");
const Summarys = mongoose.model('Summarys');
const ChatMessages = mongoose.model('ChatMessages');
//POST new user route (optional, everyone has access)
const Messages = mongoose.model('Messages');

exports.updateUser = async (req, res) => {
    console.log('helo' + req.body.user.id);
    const mongoose = require('mongoose');
    console.log(req.body.user);
    const userId = req.userId.toString();
    if (userId !== req.body.user.id) {
        return res.send({
            'status': 401,
            'message': 'Thí chú không có quyền. Vui lòng liên hệ admin nhé!'
        })
    }
    const id = mongoose.Types.ObjectId(req.body.user.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            console.log(user);
            return res.send({
                'status': 401,
                'message': 'Không tìm thấy tài khoản người dùng'
            })
        } else {
            let check = false;
            user.updateAccount = req.email;
            user.name = req.body.user.name;
            user.phone = req.body.user.phone;
            user.address = req.body.user.address;
            user.lastName = req.body.user.lastName;
            user.birthday = req.body.user.birthday;
            user.gender = req.body.user.gender;
            user.materialStatus = req.body.user.materialStatus;
            user.signature = req.body.user.signature;
            user.introduction = req.body.user.introduction;
            user.imageUrl = req.body.user.imageUrl;
            user.imageUrl = user.imageUrl === undefined || user.imageUrl === '' ? 'default-avatar.png' : user.imageUrl;
            user.save((function (err) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: "Cập nhật thông tin tài khoản không thành công"
                    });
                } else {
                    check = true;
                    return res.status(200).send({
                        status: 200,
                        user: user,
                        message: 'Cập nhật thông tin tài khoản thành công'
                    });
                }
            }));
        }
    });
};
exports.create =
    (auth.optional,
        (req, res) => {
            console.log(req);
            const user = {
                email: req.body.user.email,
                password: req.body.user.password,
                name: req.body.user.name,
                totalPoint: 0,
                imageUrl: req.body.user.imageUrl
            };
            const isHotelUser = req.body.user.isUserHotel
            const finalUser = new Users(user);
            console.log(isHotelUser + 'có phải ks không')
            if (isHotelUser) {
                finalUser.role = 1
            }
            console.log(isHotelUser +'đây là hotel????')
            Users.findOne({email: user.email}, function (err, users) {
                if (users !== null) {
                    return res.send({
                        status: 422,
                        message: "Email đã tồn tại trong hệ thống. Vui lòng chọn email khác"

                    });
                } else {
                    if (!user.email) {
                        return res.status(422).send({
                            status: 422,
                            message:
                                "email is required"

                        });
                    }

                    if (!user.password) {
                        return res.status(423).send({
                            status: 422,
                            message:
                                "Password không được để trống"

                        });
                    }

                    finalUser.setPassword(user.password);
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'booking.hotel.com.2020@gmail.com',
                            pass: '123456a@A'
                        }
                    });

                    let mailOptions = {
                        from: 'Ban quản trị website hotel.booking.2020.com <booking.hotel.com.2020@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Chào mừng đến trang web booking', // Subject line
                        text: req.body.body, // plain text body
                        html: 'Chúc mừng bạn đã đăng ký thành công tài khoản trên trang booking.com ' +
                            '<br> Vui lòng xác thực tài khoản đăng ký bằng link sau:' +
                            '<br> https://localhost:4200/active/' + finalUser._id
                        // html body
                    };

                    let mailOptionsHotels = {
                        from: 'Ban quản trị website hotel.booking.2020.com <booking.hotel.com.2020@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Chào mừng đến trang web booking', // Subject line
                        text: req.body.body, // plain text body
                        html: 'Chúc mừng bạn đã đăng ký thành công tài khoản hotels trên trang booking.com ' +
                            '<br> Bạn vui lòng trả lời lại tin nhắn với cú pháp:'
                            + '<br> Tên:'
                            + '<br> Địa chỉ:'
                            + '<br> Số điện thoại:'
                            + '<br> Hoặc liên hệ số điện thoại: 0123456789'
                            + '<br> Quản trị viên sẽ liên hệ với bạn để hoàn thành đăng kí tài khoản hotel.'
                            + '<br> Xin chân thành cảm ơn quý đối tác.'
                        // html body
                    };

                    if (finalUser == true) {
                        transporter.sendMail(mailOptionsHotels, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                    } else {
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                    }
                    Summarys.find()
                        .then(summary => {
                            let sum = summary[0];
                            console.log(sum);
                            sum.userCount++;
                            sum.save()
                                .then(() => {
                                    return finalUser.save().then(() =>
                                        res.status(200).send({
                                            message: 'Chúc mừng bạn đăng ký tài khoản thành công. Vui lòng check mail',
                                            status: 200,
                                            user: finalUser.toAuthJSON()
                                        })
                                    );
                                }).catch(err => {
                                res.status(500).send({
                                    message: err.message || 'Some error occurred while creating the gallery'
                                })
                            })
                        }).catch(err => {
                        res.send({
                            'status': 404,
                            'message': err.message || 'Some error occurred while finding summary'
                        });
                    });
                }
            });
        });
exports.createAdminAccount =
    (auth.optional,
        (req, res) => {
            const user = {
                email: req.body.user.email,
                password: req.body.user.password,
                name: req.body.user.user,
                totalPoint: 0,
                status: 1,
                role: 2
                //,
                //imageUrl: req.body.user.imageUrl
            };

            const finalUser = new Users(user);
            Users.findOne({email: user.email}, function (err, users) {
                if (users !== null) {
                    return res.send({
                        status: 422,
                        message: "Email đã tồn tại trong hệ thống. Vui lòng chọn email khác"

                    });
                } else {
                    if (!user.email) {
                        return res.status(422).send({
                            status: 422,
                            message:
                                "email is required"

                        });
                    }

                    if (!user.password) {
                        return res.status(423).send({
                            status: 422,
                            message:
                                "Password không được để trống"

                        });
                    }

                    finalUser.setPassword(user.password);
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'booking.hotel.com.2020@gmail.com',
                            pass: '123456a@A'
                        }
                    });


                    let mailOptions = {
                        from: 'Ban quản trị website hotel.booking.2020.com <booking.hotel.com.2020@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Chào mừng đến trang web booking', // Subject line
                        text: req.body.body, // plain text body
                        html: 'Chúc mừng bạn đã đăng ký thành công tài khoản quản lý trang trên trang web Booking.com '
                        // html body
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                    Summarys.find()
                        .then(summary => {
                            let sum = summary[0];
                            console.log(sum);
                            sum.userCount++;
                            sum.save()
                                .then(() => {
                                    return finalUser.save().then(() =>
                                        res.status(200).send({
                                            message: 'Chúc mừng bạn đăng ký tài khoản thành công. Vui lòng check mail',
                                            status: 200,
                                            user: finalUser.toAuthJSON()
                                        })
                                    );
                                }).catch(err => {
                                res.status(500).send({
                                    message: err.message || 'Some error occurred while creating the gallery'
                                })
                            })
                        }).catch(err => {
                        console.log(err);
                        res.send({
                            'status': 404,
                            'message': err.message || 'Some error occurred while finding summary'
                        });
                    });
                }
            });
        });
exports.resetPassword =
    (auth.optional,
        (req, res) => {
            const user = {
                email: req.body.user.email,
                password: req.body.user.password
            };
            console.log(user.email);
            Users.findOne({email: user.email}, function (err, users) {
                if (users !== null) {
                    user.password = md5(user.password);

                    console.log(md5(user.password));
                    users.setPassword(user.password);
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'booking.hotel.com.2020@gmail.com',
                            pass: '123456a@A'
                        }
                    });

                    let mailOptions = {
                        from: 'Ban quản trị website hotel.booking.2020.com <booking.hotel.com.2020@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Mật khẩu thay đổi', // Subject line
                        text: req.body.body, // plain text body
                        html: 'Bạn đã yêu cầu thay đổi mật khẩu. ' +
                            '<br> Vui lòng không tiết lộ mật khẩu cho bất kì ai:' +
                            '<br> Mật khẩu mới của bạn là: ' + user.password
                        // html body
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                    return users.save().then(() =>
                        res.status(200).send({
                            message: 'Chúc mừng bạn đổi mật khẩu tài khoản thành công. Vui lòng check mail',
                            status: 200
                        })
                    );
                } else {
                    return res.send({
                        status: 401,
                        message: 'Không tìm thấy tài khoản đăng ký của bạn'
                    });
                }
            });
        });

exports.testEmail = (req, res) => {
    if (req.body.email !== undefined || req.body.email !== '') {
        Users.findOne({email: req.body.email}, function (err, userSchema) {
            if (err) {
                return res.send({
                    status: 401,
                    message: err
                });
            }
            if (userSchema) {
                return res.send({
                    status: 200,
                    user: userSchema,
                    message: "Thêm điêm thành công"
                });
            } else {
                return res.send({
                    status: 403,
                    message: err
                });
            }
        });
    } else {
        return res.send({
            status: 401,
            message: 'email not found'
        });
    }

};
exports.changePassword = (req, res) => {
    var user = {
        email: req.body.user.user,
        password: req.body.user.oldPassword,
        newPassword: req.body.user.password,
    };
    Users.findOne({email: user.email}, function (err, userSchema) {
        if (err) {
            return res.send({
                status: 401,
                message: 'Tài khoản đăng nhập không tồn tại'
            });
        }
        if (!userSchema.validatePassword(user.password)) {
            return res.send({
                status: 401,
                message: "Mật khẩu đăng nhập không chính xác"
            });
        } else {

            if (user.password === user.newPassword) {
                return res.send({
                    status: 401,
                    message: 'Bạn phải thay đổi mật khẩu đăng nhập khác'
                });
            } else {
                userSchema.setPassword(user.newPassword);
                userSchema.save().then(() => {
                    const message = new Messages({
                        user: user.email,
                        imageUrl: '',
                        content: 'Bạn đã thay đổi mật khẩu thành công',
                        videoUrl: '',
                    });
                    message.save().then(() => {
                        res.status(200).send({
                            message: 'Bạn đã đổi mật khẩu thành công',
                            status: 200,
                            user: userSchema.toAuthJSON()
                        })
                    }).catch(() => {
                        res.send({
                            'status': 404,
                            'message': 'Bạn đổi mật khẩu thất bại'
                        })
                    })

                }).catch(() => {
                    res.status(500).send({
                        message: 'Bạn đổi mật khẩu thất bại'
                    })
                });
            }
        }
    });
};
//POST login route (optional, everyone has access)
exports.login =
    (auth.optional,
        (req, res) => {
            const user = {
                name: req.body.user.user,
                email: req.body.user.email,
                password: req.body.user.password
            };
            if (!user.email) {
                return res.status(422).json({
                    errors: {
                        email: "Vui lòng điền email"
                    }
                });
            }

            if (!user.password) {
                return res.status(422).json({
                    errors: {
                        password: "Vui lòng điền mật khẩu"
                    }
                });
            }

            Users.findOne({email: user.email}, function (err, userSchema) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: "Error"
                    });
                }
                if (!userSchema) {
                    return res.send({
                        status: 401,
                        message: "Tài khoản không tồn tại"
                    });
                }
                if (!userSchema.validatePassword(user.password)) {
                    return res.send({
                        status: 401,
                        message: "Mật khẩu của bạn sai rồi"
                    });
                }
                if (userSchema.status < 0) {
                    return res.send({
                        status: 403,
                        message: "Tài khoản của bạn đã bị khóa!"
                    });
                }
                if (userSchema.role < 0) {
                    return res.send({
                        status: 403,
                        message: "Tài khoản chưa xác thực email"
                    });
                }
                if (user) {
                    const user = new Users();
                    user.token = user.generateJWT();
                    req.session.token = user.token;
                    const finalUser = new Tokens({
                        email: userSchema.email
                    });
                    if (userSchema.imageUrl === undefined) {
                        userSchema.imageUrl = 'assets/img/new_logo.png';
                    }
                    role = userSchema.role;
                    if (role === 0) {
                        role = '';
                    }
                    finalUser.token = user.token;
                    finalUser.save().then(token => console.log("save token thanh cong"));
                    req.session.email = user.email;
                    Summarys.find()
                        .then(summary => {
                            let sum = summary[0];
                            console.log(sum);
                            sum.loginCount++;
                            sum.save()
                                .then(data => {
                                    return res.send({
                                        status: 200,
                                        user: finalUser.toAuthJSON(),
                                        role: role,
                                        objectId: userSchema._id,
                                        summary: data,
                                        image: userSchema.imageUrl
                                    });
                                }).catch(err => {
                                res.status(500).send({
                                    message: err.message || 'Some error occurred while creating the gallery'
                                })
                            })
                        }).catch(err => {
                        console.log(err);
                        res.send({
                            'status': 404,
                            'message': err.message || 'Some error occurred while finding summary'
                        })
                    })

                } else {
                    return res.send({
                        status: 403,
                        message: "Không tìm thấy tài khoản"
                    });
                }
            });
        });

//POST login route (optional, everyone has access)
exports.loginAdmin =
    (auth.optional,
        (req, res) => {
            const user = {
                name: req.body.user.user,
                email: req.body.user.email,
                password: req.body.user.password
            };
            if (!user.email) {
                return res.status(422).json({
                    errors: {
                        email: "Vui lòng điền email"
                    }
                });
            }

            if (!user.password) {
                return res.status(422).json({
                    errors: {
                        password: "Vui lòng điền mật khẩu"
                    }
                });
            }

            Users.findOne({email: user.email}, function (err, userSchema) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: "Error"
                    });
                }
                if (!userSchema) {
                    return res.send({
                        status: 401,
                        message: "Tài khoản không tồn tại"
                    });
                }
                if (!userSchema.validatePassword(user.password)) {
                    return res.send({
                        status: 401,
                        message: "Tài khoản không tồn tại"
                    });
                }
                if (userSchema.status < 0) {
                    return res.send({
                        status: 403,
                        message: "Tài khoản của bạn đã bị khóa!"
                    });
                }
                if (userSchema.role < 1) {
                    return res.send({
                        status: 403,
                        message: "Tài khoản không có quyền đăng nhập"
                    });
                }
                if (user) {
                    const user = new Users();
                    user.token = user.generateJWT();
                    req.session.token = user.token;
                    const finalUser = new Tokens({
                        email: userSchema.email
                    });
                    if (userSchema.imageUrl === undefined) {
                        userSchema.imageUrl = './uploads/default-avatar.png';
                    }
                    role = userSchema.role;
                    if (role === 0) {
                        role = '';
                    }
                    finalUser.token = user.token;
                    finalUser.save().then(token => console.log("save token thanh cong"));
                    req.session.email = user.email;
                    Summarys.find()
                        .then(summary => {
                            let sum = summary[0];
                            console.log(sum);
                            sum.loginCount++;
                            sum.save()
                                .then(data => {
                                    return res.send({
                                        status: 200,
                                        user: finalUser.toAuthJSON(),
                                        role: role,
                                        objectId: userSchema._id,
                                        summary: data,
                                        image: userSchema.imageUrl
                                    });
                                }).catch(err => {
                                res.status(500).send({
                                    message: err.message || 'Some error occurred while creating the gallery'
                                })
                            })
                        }).catch(err => {
                        console.log(err);
                        res.send({
                            'status': 404,
                            'message': err.message || 'Some error occurred while finding summary'
                        })
                    })

                } else {
                    return res.send({
                        status: 403,
                        message: "Không tìm thấy tài khoản"
                    });
                }
            });
        });

exports.logout =
    ("/logout",
        (req, res) => {
            if (req.session.user && req.cookies.token) {
                console.log("token" + req.cookies.token);
                res.clearCookie("user");
                res.redirect("/");
            } else {
                res.redirect("/login");
            }
        });
exports.addPoint = (req) => {
    console.log("testet" + req.body.user.email);

};
exports.removePoint = (req, res) => {
    console.log("testet" + req.body.user.email);
    Users.findOne({email: req.body.user.email}, function (err, userSchema) {
        if (err) {
            console.log(err);
            return res.send({
                status: 401,
                message: "Error"
            });
        }
        if (userSchema) {
            console.log(userSchema.totalPoint);
            if (userSchema.totalPoint !== undefined) {
                if (parseInt(userSchema.totalPoint) > 0) {
                    userSchema.totalPoint--;
                    console.log(userSchema.totalPoint);
                } else {
                    res.send({
                        status: 401,
                        message: "Sorry đã hết điểm để trừ rồi bạn ạ"
                    });
                }
                userSchema.save((function (err) {
                    if (err) {
                        console.log(err);
                        res.send({
                            status: 401,
                            message: "Error"
                        });
                    } else {
                        res.send({
                            status: 200,
                            message: "Trừ điểm thành công"
                        });
                    }
                }))
            }
        }
    });
};
exports.getUsers = (async (req, res) => {
    await Users.find()
        .then(users => {
            res.status(200).send(users
            )
        }).catch(err => {
            res.send({
                'status': 404,
                'message': err.message || 'Some error occurred while finding users'
            })
        })
});
exports.getActiveUsers = (async (req, res) => {
    await Users.find({
        status: {
            $gte: 0
        },
        role: {
            $gte: 0
        }
    }).then(users => {
        res.status(200).send(users
        )
    }).catch(err => {
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding users'
        })
    })
});
exports.getNewUsers = (async (req, res) => {
    Users.find({
        role: {
            $gte: 0
        }, status: {
            $gte: -1
        }
    })
        .sort({createdAt: -1})
        .limit(10)
        .then(users => {
            res.status(200).send(users
            )
        }).catch(err => {
        res.send({
            'status': 404,
            'message': err.message || 'Some error occurred while finding users'
        })
    })
});

exports.updateRole = async (req, res) => {
    console.log('helo' + req.body.user.id);
    console.log('helo' + req.body.user.role);
    const mongoose = require('mongoose');
    const id = mongoose.Types.ObjectId(req.body.user.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            console.log(user);
            return res.send({
                'status': 401,
                'message': 'user not found'
            })
        } else {
            console.log(user);
            user.role = req.body.user.role;
            user.save((function (err) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: "Error"
                    });
                } else {
                    return res.status(200).send({
                        status: 200,
                        user: user
                    });
                }
            }));
        }
    });
};

exports.updateReport = async (req, res) => {
    console.log('helo' + req.body.user.id);
    var mongoose = require('mongoose');
    var id = mongoose.Types.ObjectId(req.body.user.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            console.log(user);
            return res.send({
                'status': 401,
                'message': 'user not found'
            })
        } else {
            console.log(user);
            user.warningReport++;
            user.save((function (err) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: "Error"
                    });
                } else {
                    return res.status(200).send({
                        status: 200,
                        user: user
                    });
                }
            }));
        }
    });
};
exports.bannedUser = async (req, res) => {
    console.log('helo' + req.body.user.id);
    var mongoose = require('mongoose');
    var id = mongoose.Types.ObjectId(req.body.user.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            console.log(user);
            return res.send({
                'status': 401,
                'message': 'user not found'
            })
        } else {
            console.log(user);
            user.status = 0;
            if (user.role > 1) {
                return res.send({
                    status: 401,
                    message: "Tài khoản quản trị trang không được tác động!"
                });
            } else {
                user.save((function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: "Error"
                        });
                    } else {
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'booking.hotel.com.2020@gmail.com',
                                pass: '123456a@A'
                            }
                        });

                        let mailOptions = {
                            from: 'Ban quản trị website hotel.booking.2020.com <booking.hotel.com.2020@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Chào mừng đến trang web Booking', // Subject line
                            text: req.body.body, // plain text body
                            html: 'Tài khoản của bạn đã bị khóa vì vi pham quy định của website, pháp luật của nhà nước.' +
                                'Vui lòng liên hệ lại với email: longdeptrai@gmaillcom'
                            // html body
                        };

                        let mailOptionsIsHotel = {
                            from: 'Ban quản trị website hotel.booking.2020.com <booking.hotel.com.2020@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Chào mừng đến trang web Booking', // Subject line
                            text: req.body.body, // plain text body
                            html: 'Tài khoản của bạn đã bị khóa vì khách sạn vi pham quy định của website.' +
                                'Vui lòng liên hệ lại với email: longdeptrai@gmaillcom'
                            // html body
                        };

                        if (user.role == 1) {
                            transporter.sendMail(mailOptionsIsHotel, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            });
                        } else {
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            });
                        }

                        return res.status(200).send({
                            status: 200,
                            user: user
                        });
                    }
                }));
            }
        }
    });
};
exports.openUser = async (req, res) => {
    console.log('helo' + req.body.user.id);
    var mongoose = require('mongoose');
    var id = mongoose.Types.ObjectId(req.body.user.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            console.log(user);
            return res.send({
                'status': 401,
                'message': 'user not found'
            })
        } else {
            console.log(user);
            user.status = 1;
            if (user.role > 1) {
                return res.send({
                    status: 401,
                    message: "Tài khoản quản trị trang không được tác động!"
                });
            } else {
                user.save((function (err) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: "Error"
                        });
                    } else {
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'booking.hotel.com.2020@gmail.com',
                                pass: '123456a@A'
                            }
                        });
                        let mailOptions = {
                            from: 'Ban quản trị website BookingHotel <booking.hotel.com.2020@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Chào mừng đến trang web BookingHotel', // Subject line
                            text: req.body.body, // plain text body
                            html: 'Xin chúc mừng! Tài khoản của bạn đã được mở. Vui lòng đăng nhập trang chủ website BookingHotel' +
                                ': localhost:4200/index'
                            // html body
                        };

                        let mailOptionsIsHotels = {
                            from: 'Ban quản trị website BookingHotel <booking.hotel.com.2020@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: 'Chào mừng đến trang web booking.hotel.com.2020', // Subject line
                            text: req.body.body, // plain text body
                            html: 'Xin chúc mừng! Tài khoản hotels của bạn đã được mở. Vui lòng đăng nhập website:' +
                                ': localhost:4200/login'
                                + '<br> để quản lý khách sạn của bạn.'
                            // html body
                        };
                        if (user.role == 1) {
                            transporter.sendMail(mailOptionsIsHotels, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            });
                        } else {
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            });
                        }
                        return res.status(200).send({
                            status: 200,
                            user: user
                        });
                    }
                }));
            }
        }
    });
};
exports.activeMember = async (req, res) => {
    console.log('helo' + req.params.id);
    const mongoose = require('mongoose');
    const id = mongoose.Types.ObjectId(req.params.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            return res.send({
                'status': 401,
                'message': 'user not found'
            })
        } else {
            user.role = 0;
            user.status = 1;
            user.save((function (err) {
                if (err) {
                    return res.send({
                        status: 401,
                        message: "Error"
                    });
                } else {
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'booking.hotel.com.2020@gmail.com',
                            pass: '123456a@A'
                        }
                    });
                    let mailOptions = {
                        from: 'Ban quản trị website Booking <booking.hotel.com.2020@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Chào mừng đến trang web Booking', // Subject line
                        text: req.body.body, // plain text body
                        html: 'Xin chúc mừng! Tài khoản của bạn đã được mở. Vui lòng đăng nhập trang chủ website Booking' +
                            ': https://google.com/'
                        // html body
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                    res.send({
                        status: 200,
                        message: ' Chúc mừng bạn đã xác thực email thành công!\n' +
                            '  Vui lòng đăng nhập để tiếp tục trải nghiệm website'
                    });
                }
            }));
        }
    });
};
exports.getMemberInfo = async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    await Users.findOne({_id: id}, function (err, user) {
        if (err || user === null) {
            console.log(user);
            return res.send({
                'status': 401,
                'message': 'user not found'
            })
        } else {
            return res.status(200).send(user);

        }
    })
};

exports.getUserOnlineInfo = async (req, res) => {
    // console.log('hehe' + req.body.user);
    // console.log(req.body.user);
    let idUsers = req.body.user;
    console.log(idUsers.length);
    let idObjects = [];
    idUsers.forEach(id => {
        idObjects.push(mongoose.Types.ObjectId(id));
    });
    await Users.find({
        _id: {
            $in: idObjects
        }
    }, function (err, users) {
        console.log(users);
        if (err || users === null) {
            return res.send({
                'status': 500,
                'message': 'user not found'
            })
        } else {
            return res.send({
                'status': 200,
                'user': users,
                'message': 'user not found'
            })
        }

    })
};
exports.getAllUserInfo = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.body.user._id);
    let newUsers = [];
    await Users.find({}).then(async users => {
        for (let user of users) {
            if (user._id.toString() !== req.body.user._id) {
                let id = mongoose.Types.ObjectId(user._id);
                let chatMessResult = await this.getAllChatMess(id, userId, 0);
                user.warningReport = chatMessResult.length;
                newUsers.push(user);
            }
        }
        return res.send({
            'status': 200,
            'users': newUsers,
            'message': 'user not found'
        });
    });
};
exports.getAllChatMess = function (fromUser, toUser, news) {
    return ChatMessages.find({fromUser: fromUser, toUser: toUser, news: news});
}
exports.getTopUsers = (async (req, res) => {
    await Users.find({
        role: {
            $gte: 0
        }, status: {
            $gte: -1
        }
    })
        .sort({totalPoint: -1})
        .limit(10)
        .then(users => {
            res.status(200).send(users
            )
        }).catch(err => {
            res.send({
                'status': 404,
                'message': err.message || 'Some error occurred while finding users'
            })
        })
});


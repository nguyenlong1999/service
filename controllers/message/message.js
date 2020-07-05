const mongoose = require('mongoose');
const auth = require("../../routers/auth");
const Messages = mongoose.model('Messages');
const Users = mongoose.model("Users");
exports.getMessages = (async (req, res) => {
    await Messages.find()
        .then(messages => {
            res.status(200).send(messages
            )
        }).catch(err => {
            console.log(err);
            res.send({
                'status': 404,
                'message': err.message || 'Some error occurred while finding message'
            });
        });
});

exports.findMessage = async (req, res) => {
    await Messages.find({ user: req.body.user.email }, function (err, messages) {
        if (err) {
            console.log(err);
            return res.send({
                'status': 401,
                'message': 'message not found'
            })
        } else {
            for (let mess of messages) {
                // mess.news++;
                mess.save().then(() => {
                });
            }
            res.status(200).send({
                message: messages
            })
        }
    }).sort({
        createdAt: -1
    }).limit(15)
};
exports.updateNews = async (req, res) => {
    const news = 1;
    await Messages.updateMany(
        { user: req.body.user.email },
        { $set: { "news": news } }
    ).then(messages => {
        return res.send({
            status: 200,
            message: messages
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while update the note'
        });
    });
}
exports.createMessage = (req, res) => {
    const message = new Messages({
        user: req.body.message.user,
        content: req.body.message.content
    });
    Users.findOne({ email: req.body.message.user }, function (err, userSchema) {
        if (err) {
            return res.send({
                status: 401,
                message: err
            });
        }
        if (userSchema) {
            message.user = userSchema;
            message.save().then(() => {
                Messages.find({ user: req.body.message.user }, function (err, messages) {
                    if (err) {
                        return res.send({
                            status: 401,
                            message: err
                        });
                    }
                    if (messages) {
                        return res.send({
                            newMessage: message,
                            messages: messages,
                            status: 200,
                            message: "Thêm thông báo thành công"
                        });
                    }
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the note'
                });
            });
        } else {
            return res.send({
                status: 403,
                message: err
            });
        }
    });
};
exports.deleteMessage = (auth.optional,
    (req, res) => {
        const message = new Messages({
            user: req.body.message.user.email
        });
        Messages.find({ user: message.user })
            .then((messages) => {
                if (!messages) {
                    return res.status(400).send({
                        message: "can not found current user"
                    });
                }
                Messages.deleteOne({ _id: messageed._id }, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.send({
                            status: 401,
                            message: "lỗi xóa lượt ưu thích"
                        });
                    } else {
                        return res.send({
                            result: result,
                            status: 200,
                            message: "xóa điểm thành công"
                        });
                    }
                });
            });
    });

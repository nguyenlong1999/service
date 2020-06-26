const mongoose = require('mongoose');
const auth = require("../../routers/auth");
const Messages = mongoose.model('Messages');
const Users = mongoose.model("Users");
const ChatMessages = mongoose.model("ChatMessages");

exports.getChatMessages = (async (req, res) => {
  await ChatMessages.find().then(messages => {
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
exports.findChatMessage = async (req, res) => {
  const fromUser = mongoose.Types.ObjectId(req.body.chatMess.fromUser);
  const toUser = mongoose.Types.ObjectId(req.body.chatMess.toUser);
  await ChatMessages.find({ fromUser: fromUser, toUser: toUser }, function (err, messages) {
    if (err) {
      console.log(err);
      return res.send({
        'status': 401,
        'message': 'message not found'
      })
    } else {
      for (let mess of messages) {
        mess.news++;
        mess.save().then(() => {
        });
      }
      res.status(200).send({
        message: messages
      });
    }
  }).sort({
    createdAt: -1
  })
    .limit(10)
};
exports.createChatMessage = (req, res) => {
  const chatMessage = new ChatMessages({
    fromUser: req.body.chatMess.fromUser,
    toUser: req.body.chatMess.toUser,
    content: req.body.chatMess.content
  });
  const fromUserId = mongoose.Types.ObjectId(req.body.chatMess.fromUser);
  const toUserId = mongoose.Types.ObjectId(req.body.chatMess.toUser);
  /* Thêm sequence tự tăng cho tất cả bản ghi */

  // ChatMessages.find({}).then(count => {
  //   chatMessage.sequence = (count.length) + 1;
  // });

  /* Thêm sequence tự tăng kiểu 2 user chat với nhau */

  // ChatMessages.find({
  //   $or: [
  //     { fromUser: fromUserId, toUser: toUserId },
  //     { fromUser: toUserId, toUser: fromUserId },
  //   ]
  // }).then(count => {
  //   console.log(count);
  //   chatMessage.sequence = (count.length) + 1;
  //   return res.send({
  //     chatMessage: chatMessage
  //   });
  // });

  Users.findOne({ _id: fromUserId }, function (err, userSchema) {
    if (err) {
      return res.send({
        status: 401,
        message: err
      });
    }
    if (userSchema) {
      Users.findOne({ _id: toUserId }, function (err, user2Schema) {
        if (err) {
          return res.send({
            status: 401,
            message: err
          });
        }
        if (user2Schema) {
          chatMessage.save().then(() => {
            return res.send({
              result: chatMessage,
              status: 200,
              message: "Gửi tin nhắn thành công"
            });
          }).catch(err => {
            res.status(500).send({
              message: err.message || 'Some error occurred while creating the message'
            });
          });
        } else {
          return res.send({
            status: 403,
            message: err
          });
        }
      });
    }
    else {
      return res.send({
        status: 403,
        message: err
      });
    }
  });
}
const mongoose = require('mongoose');
const auth = require("../../routers/auth");
const Messages = mongoose.model('Messages');
const Users = mongoose.model("Users");
const ChatMessages = mongoose.model("ChatMessages");

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
        mess.news++;
        mess.save().then(() => {
        });
      }
      res.status(200).send({
        message: messages
      })
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
  console.log(chatMessage);
  // Users.findOne({ email: req.body.message.user }, function (err, userSchema) {
  //   if (err) {
  //     return res.send({
  //       status: 401,
  //       message: err
  //     });
  //   }
  //   if (userSchema) {
  //     message.user = userSchema
  //   } else {
  //     return res.send({
  //       status: 403,
  //       message: err
  //     });
  //   }
  // });
  chatMessage.save()
    .then(() => {
      return res.send({
        result: chatMessage,
        status: 200,
        message: "Gửi tin nhắn thành công"
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the note'
      });
    });
};

module.exports = app => {
  const chatMessages = require("../controllers/chat-message/chat-message");
  var VerifyToken = require(__root + 'auth/VerifyToken');
  // app.post("/createMessage", VerifyToken,messages.createMessage);
  //
  // app.post("/deleteMessage",VerifyToken, messages.deleteMessage);
  // app.get("/getMessages", messages.getMessages);
  app.post("/createChatMessage", /* VerifyToken, */chatMessages.createChatMessage);
  app.post("/findChatMessage",VerifyToken,chatMessages.findChatMessage);
};

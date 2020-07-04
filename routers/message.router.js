
module.exports = app => {
  const messages = require("../controllers/message/message");
  // var VerifyToken = require(__root + 'auth/VerifyToken');
  // app.post("/createMessage", VerifyToken,messages.createMessage);
  //
  // app.post("/deleteMessage",VerifyToken, messages.deleteMessage);
  app.get("/getMessages", messages.getMessages);
  app.post("/findMessage", messages.findMessage);
  app.post("/createMessage", messages.createMessage);
  app.post("/updateNews", messages.updateNews);
};

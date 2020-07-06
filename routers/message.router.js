module.exports = app => {
    const messages = require("../controllers/message/message");
    // var VerifyToken = require(__root + 'auth/VerifyToken');
    var VerifyUserByToken = require(__root + 'auth/VerifyUserByToken');
    // app.post("/createMessage", VerifyToken,messages.createMessage);
    //
    // app.post("/deleteMessage",VerifyToken, messages.deleteMessage);
    app.get("/getMessages", VerifyUserByToken, messages.getMessages);
    app.post("/findMessage", VerifyUserByToken, messages.findMessage);
    app.post("/createMessage", VerifyUserByToken, messages.createMessage);
    app.post("/updateNews", VerifyUserByToken, messages.updateNews);
};

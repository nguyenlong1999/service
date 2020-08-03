module.exports = app => {
  var VerifyToken = require(__root + 'auth/VerifyToken');
  const tokens = require("../controllers/tokens");
  app.post("/deleteToken", tokens.deleteToken);
  app.post("/currentAuthen", tokens.currentAuthen);
};

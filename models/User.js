const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var config = require('../config'); // get our config file

const {Schema} = mongoose;

const UsersSchema = new Schema({
    email: {type: String, default: ''},
    name: {type: String, default: ''},
    lastName: {type: String, default: ''},
    birthday: {type: Number},
    materialStatus: {type: String, default: ''},
    phone: {type: String, default: ''},
    signature: {type: String, default: ''},
    introduction: {type: String, default: ''},
    address: {type: String, default: ''},
    gender: {type: Number, default: 1},
    imageUrl: {type: String, default: 'default-avatar.png'},
    hash: String,
    salt: String,
    totalPoint: {type: Number, default: 3},
    role: {type: Number, default: 0},
    warningReport: {type: Number, default: 0},
    status: {type: Number, default: -1},
    updateAccount: String,
}, {
    timestamps: true
});

UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    var token = jwt.sign({id: this._id}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token;
}

UsersSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

mongoose.model('Users', UsersSchema);

const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
    user: {type: Object},
    hotel: {type: Object},
    content: {type: String, default: ''},
    order:Number
}, {
    timestamps: true
});
module.exports = mongoose.model('Comments', CommentSchema);

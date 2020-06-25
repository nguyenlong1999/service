const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const ChatMessageSchema = mongoose.Schema({
  fromUser: { type: ObjectId },
  toUser: { type: ObjectId },
  content: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  news: { type: Number, default: 0 },
  description: { type: String, default: 'Tin nhắn nè!' }
}, {
  timestamps: true
});
module.exports = mongoose.model('ChatMessages', ChatMessageSchema);

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 body: { type: String, default: '' },
  fileUrl: { type: String },
  read:     { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ fromUser: 1, toUser: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

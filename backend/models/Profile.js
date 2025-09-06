const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  designation: String,
  profilePic: String,
  age: Number,
  qualification: String,
  skills: [String],
  skillsToLearn: [String],
  expoPushToken: String  
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);

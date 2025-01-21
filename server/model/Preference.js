const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  adminId: {type: Number, required: true, unique: false},
  title: { type: String, required: true, unique: false },
  content: { type: String, required: true, unique: false },
});

// const UserModel = mongoose.model('user', UserSchema);

module.exports = mongoose.model('preference', PreferenceSchema);
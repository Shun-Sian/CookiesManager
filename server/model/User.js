const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: {type: String, required: true, unique: false},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: false },
  isConcentGiven: { type: Boolean, required: false, unique: false}
});

module.exports = mongoose.model('user', UserSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

module.exports = mongoose.model('User', userSchema);

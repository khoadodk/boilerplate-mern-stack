const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber'
    },
    resetPasswordLink: {
      data: String,
      default: ''
    }
  },
  { timestamps: true }
);

userSchema
  .virtual('password')
  .set(function(password) {
    // create a temporarity variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

//The advantage of bcrypt is to generate salt, hash and compare the password
//Here we use the build-in module crypto and generate our salt,
//then compare the encryted password

userSchema.methods = {
  //compare the input password to the hashed password in the server
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      //crypto comes with nodejs
      //https://nodejs.org/api/crypto.html
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      console.error(err);
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

module.exports = mongoose.model('User', userSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  sessionToken: {
    type: String,
    unique: true,
    sparse: true
  },
  instagramSessionToken: {
    type: String
  },
  hotspots: [{
    name: String,
    description: String,
    lng: Number,
    lat: Number
  }]
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  var that = this;
  return bcrypt.genSalt(function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(that.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      that.password = hash;
      return next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  return bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, isMatch);
    }
  });
};

userSchema.statics.isEmailExist = function(email, callback) {
  return this.count({ email: email }, callback);
};

userSchema.statics.randomToken = function() {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'first name field should not be blank'],
    minLength: 3,
    maxLength: 255,
    lowercase: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, 'last name field should not be blank'],
    minLength: 3,
    maxLength: 255,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'email field should not be blank'],
    minLength: 10,
    maxLength: 255,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password field should not be blank'],
    minLength: 6,
    maxLength: 1024,
  },
  forgotToken: {
    type: String,
    default: ""
  },
  created_At: {
    type: Date,
    default: Date.now
  },
});

// remove version key in every query
userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const User = new mongoose.model('user', userSchema);

module.exports = User;
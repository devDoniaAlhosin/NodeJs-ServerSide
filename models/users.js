const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userRoles = require("../utilities/userRoles");
const userStatus = require("../utilities/userStatus");
const Book = require("../models/books"); // Adjust the path as needed
const Author = require("../models/authors"); // Adjust the path as needed
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Field Must be a valid Email Address"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "uploads/profile.png",
  },
  books: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      status: {
        type: String,
        enum: userStatus,
        default: userStatus.NOTREAD,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
      },
      // title: String,
      // description: String,
      // published: Date,
      // avgRating: Number,
      // reviews_count: Number,
      // isbn: String,
      // image: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

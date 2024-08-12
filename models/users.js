const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userRoles = require("../utilities/userRoles");
// User Schema
const UserSchema = new mongoose.Schema({
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
});

// Create the User model
const User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// // Function to get a user by ID
// module.exports.getUserById = async function (id) {
//   try {
//     return await User.findById(id).exec(); // use .exec() to return a promise
//   } catch (err) {
//     throw err;
//   }
// };
// // Function to get a user by username
// module.exports.getUserByUserName = async function (username) {
//   try {
//     const user = await User.findOne({ username: username }, { _v: false });
//     return user; // return the user found
//   } catch (err) {
//     console.error("Error finding user by username:", err);
//     throw err; // throw the error to be handled by the caller
//   }
// };
// module.exports.addUser = async function (userData) {
//   try {
//     console.log("Received user data:", userData); // Log the incoming data

//     // Check if email or username already exists
//     const existingUser = await User.findOne({
//       $or: [{ email: userData.email }, { username: userData.username }],
//     });

//     if (existingUser) {
//       console.log("User already exists:", existingUser);
//       return { success: false, msg: "User already exists" };
//     }

//     // Generate salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(userData.password, salt);

//     console.log("Hashed password:", hashedPassword); // Log the hashed password

//     // Create a new User instance
//     const newUser = new User({
//       name: userData.name,
//       email: userData.email,
//       username: userData.username,
//       password: hashedPassword,
//     });

//     console.log("Saving new user:", newUser); // Log the new user data

//     await newUser.save();
//     return { success: true };
//   } catch (err) {
//     console.error("Error during user registration:", err); // Log the exact error
//     return { success: false, msg: "Failed to register User" };
//   }
// };

// module.exports.comparePassword = function (candidatePassword, hash, callback) {
//   if (typeof callback !== "function") {
//     throw new TypeError("Callback must be a function");
//   }

//   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
//     if (err) {
//       return callback(err);
//     }
//     callback(null, isMatch);
//   });
// };

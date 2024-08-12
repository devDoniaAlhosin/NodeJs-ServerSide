const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/users");
const httpStatusText = require("../utilities/httpStatusText");
const appError = require("../utilities/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utilities/generateJWT");

// get all users
const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  // get all Users from DB using Users Model
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

// register
const register = asyncWrapper(async (req, res, next) => {
  const { name, email, username, password, role, avatar } = req.body;
  const oldUserEmail = await User.findOne({ email: email });
  const oldUserUsername = await User.findOne({ username: username });
  if (oldUserEmail || oldUserUsername) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // adding user
  const newUser = new User({
    name,
    email,
    username,
    password: hashedPassword, // should be hashed First
    role,
    avatar: req.file.filename,
  });

  // generate JWT token
  const token = await generateJWT({
    username: newUser.username,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

// login
const login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    const error = appError.create(
      "Email and Password are Required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ username: username });

  if (!user) {
    const error = appError.create("user not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // logged in successfully

    const token = await generateJWT({
      username: user.username,
      id: user._id,
      role: user.role,
    });

    return res.json({ status: httpStatusText.SUCCESS, data: { token } });
  } else {
    const error = appError.create("something wrong", 500, httpStatusText.ERROR);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};

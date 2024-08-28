const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const config = require("../config/db");
// const passport = require("../config/passport");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { session } = require("passport");
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middleware/verifyToken");
const appError = require("../utilities/appError");
const multer = require("multer");
const cloudinary = require("../utilities/cloudinary");
const multerMemoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File received:", file);
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};

const upload = multer({
  storage: multerMemoryStorage,
  fileFilter: fileFilter,
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// get all users
router.route("/").get(verifyToken, usersController.getAllUsers);

// Register route
router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

// Login
router.route("/login").post(usersController.login);

// Add a Book  for each user
router.post("/:userId/books/:bookId", usersController.addBookToUser);

// get all books that a user has rated
router.route("/:userId/books").get(usersController.getBookToUser);

// Check user Existance
router.route("/:userId/exists").get(usersController.checkUserExists);

module.exports = router;

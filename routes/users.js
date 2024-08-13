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
  storage: diskStorage,
  fileFilter,
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

router.post("/:userId/books", usersController.addOrUpdateBook);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// another
// router.post("/register", async (req, res, next) => {
//   console.log("Register route hit with data:", req.body);

//   // let newUser = new User({
//   //   name: req.body.name,
//   //   email: req.body.email,
//   //   username: req.body.username,
//   //   password: req.body.password,
//   // });

//   try {
//     const result = await User.addUser(newUser);
//     if (result.success) {
//       res
//         .status(201)
//         .json({ success: true, msg: "User registered successfully" });
//     } else {
//       res.status(500).json({ success: false, msg: "Failed to register User" });
//     }
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ success: false, msg: "Failed to register User" });
//   }
// });

// Login route
// router.post("/authenticate", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User Not Found" });
//     }

//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if (err) {
//         return res.status(500).json({ success: false, msg: "Server Error" });
//       }
//       if (isMatch) {
//         const token = jwt.sign({ _id: user._id }, "secret", {
//           expiresIn: "1h",
//         });
//         return res.json({
//           success: true,
//           token: "Bearer " + token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//           },
//         });
//       } else {
//         return res.status(400).json({ success: false, msg: "Wrong Password" });
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, msg: "Server Error" });
//   }
// });

// router.get(
//   "/admin",
//   passport.authenticate("jwt", { session: false }),
//   (req, res, next) => {
//     res.json({ user: req.user });
//   }
// );

module.exports = router;
